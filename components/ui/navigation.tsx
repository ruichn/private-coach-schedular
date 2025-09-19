"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentPage?: string
}

export default function Navigation({ currentPage }: NavigationProps) {
  const getLinkClassName = (href: string, matchPath?: string) => {
    const isActive = currentPage === href || (matchPath && currentPage?.startsWith(matchPath))
    return `text-sm font-medium hover:text-gray-600 transition-colors ${
      isActive ? 'text-blue-600 font-semibold' : ''
    }`
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Coach Robe Sports Training
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/sessions" className={getLinkClassName('/sessions')}>
            Sessions
          </Link>
          <Link href="/cancel" className={getLinkClassName('/cancel')}>
            Cancel Registration
          </Link>
          <Link href="/about" className={getLinkClassName('/about')}>
            About
          </Link>
          <Link href="/contact" className={getLinkClassName('/contact')}>
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Coach Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}