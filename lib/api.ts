import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

export const api = axios.create({
  baseURL: "https://observcore-api.mateusdata.com.br/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token")
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = Cookies.get("refresh_token")

      if (!refreshToken) {
        Cookies.remove("access_token")
        Cookies.remove("refresh_token")
        window.location.href = "/login"
        return Promise.reject(error)
      }

      try {
        const response = await api.post("/refresh-token", { token: refreshToken }
        )

        const { access_token, refresh_token } = response.data

        Cookies.set("access_token", access_token, { expires: 1 })
        Cookies.set("refresh_token", refresh_token, { expires: 7 })

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }

        processQueue(null, access_token)
        isRefreshing = false

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null)
        isRefreshing = false

        Cookies.remove("access_token")
        Cookies.remove("refresh_token")
        window.location.href = "/login"

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
