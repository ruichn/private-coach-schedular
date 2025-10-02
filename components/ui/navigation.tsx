"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface NavigationProps {
  currentPage?: string
}

interface Session {
  id: number
  sport: string
  ageGroup: string
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [sportAgeGroups, setSportAgeGroups] = useState<Array<{ sport: string; ageGroup: string }>>([])

  useEffect(() => {
    fetchSportAgeGroups()
  }, [])

  const fetchSportAgeGroups = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const sessions: Session[] = await response.json()

        // Get unique sport-ageGroup combinations
        const uniqueGroups = new Map<string, { sport: string; ageGroup: string }>()
        sessions.forEach(session => {
          const key = `${session.sport}-${session.ageGroup}`
          if (!uniqueGroups.has(key)) {
            uniqueGroups.set(key, { sport: session.sport, ageGroup: session.ageGroup })
          }
        })

        // Sort by sport (volleyball first, then basketball), then by age group
        const sportPriority = ['volleyball', 'basketball']
        const sorted = Array.from(uniqueGroups.values()).sort((a, b) => {
          const aSportIndex = sportPriority.indexOf(a.sport.toLowerCase())
          const bSportIndex = sportPriority.indexOf(b.sport.toLowerCase())
          const aSportRank = aSportIndex === -1 ? sportPriority.length : aSportIndex
          const bSportRank = bSportIndex === -1 ? sportPriority.length : bSportIndex

          if (aSportRank !== bSportRank) {
            return aSportRank - bSportRank
          }
          return a.ageGroup.localeCompare(b.ageGroup)
        })

        setSportAgeGroups(sorted)
      }
    } catch (error) {
      console.error('Error fetching sessions for navigation:', error)
    }
  }

  const getLinkClassName = (href: string, matchPath?: string) => {
    const isActive = currentPage === href || (matchPath && currentPage?.startsWith(matchPath))
    return `text-sm font-medium hover:text-gray-600 transition-colors ${
      isActive ? 'text-blue-600 font-semibold' : ''
    }`
  }

  // Group by sport for the dropdown
  const groupedBySport = sportAgeGroups.reduce<Record<string, string[]>>((acc, { sport, ageGroup }) => {
    if (!acc[sport]) {
      acc[sport] = []
    }
    acc[sport].push(ageGroup)
    return acc
  }, {})

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Coach Robe Sports Training
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className={`${getLinkClassName('/sessions')} flex items-center gap-1 outline-none`}>
              Sessions
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/sessions" className="cursor-pointer">
                  All Sessions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {Object.entries(groupedBySport).map(([sport, ageGroups]) => (
                <div key={sport}>
                  <DropdownMenuLabel className="text-xs text-gray-500">
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </DropdownMenuLabel>
                  {ageGroups.map(ageGroup => (
                    <DropdownMenuItem key={`${sport}-${ageGroup}`} asChild>
                      <Link
                        href={`/teams/robe/${encodeURIComponent(sport)}/${encodeURIComponent(ageGroup)}`}
                        className="cursor-pointer pl-6"
                      >
                        {ageGroup}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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