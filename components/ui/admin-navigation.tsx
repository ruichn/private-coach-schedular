"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AdminNavigationProps {
  currentPage?: string
  onLogout?: () => void
}

export default function AdminNavigation({ currentPage, onLogout }: AdminNavigationProps) {
  const getLinkClassName = (href: string) => {
    const isActive = currentPage === href
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
          <Link href="/admin" className={getLinkClassName('/admin')}>
            Sessions
          </Link>
          <Link href="/admin/participants" className={getLinkClassName('/admin/participants')}>
            Participants
          </Link>
          <Link href="/admin/locations" className={getLinkClassName('/admin/locations')}>
            Locations
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          {onLogout && (
            <Button variant="ghost" onClick={onLogout} className="text-red-600 hover:text-red-700">
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}