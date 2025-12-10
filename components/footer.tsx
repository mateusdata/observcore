import React from 'react'
import { ModeToggle } from './ui/mode-toggle'
import { Activity } from 'lucide-react'

export default function Footer() {
  return (
      <footer className="w-full border-t py-6 md:py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} ObservCore.
              </p>
            </div>
            <ul className="flex flex-wrap items-center">
              <li className="inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-muted-foreground">
                <a className="text-xs text-muted-foreground underline hover:text-foreground hover:decoration-2 focus:outline-none focus:decoration-2" href="https://github.com/mateusdata" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li className="inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-muted-foreground">
                <a className="text-xs text-muted-foreground underline hover:text-foreground hover:decoration-2 focus:outline-none focus:decoration-2"  href="https://observcore-api.mateusdata.com.br/api/docs">
                  Documentação
                </a>
              </li>
              <li className="inline-block">
                <ModeToggle />
              </li>
            </ul>
          </div>
        </div>
      </footer>
  )
}
