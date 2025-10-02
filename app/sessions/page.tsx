"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/ui/navigation"
import { SessionCard } from "@/components/ui/session-card"

interface Session {
  id: number
  sport: string
  ageGroup: string
  date: string
  time: string
  location: string
  address: string
  maxParticipants: number
  currentParticipants: number
  price: number
  focus: string
  status: string
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      } else {
        console.error('Failed to fetch sessions, status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupedSessions = useMemo(() => {
    const groups: Record<string, Record<string, Session[]>> = {}

    sessions.forEach((session) => {
      const sportKey = session.sport || "other"
      const ageKey = session.ageGroup || "other"

      if (!groups[sportKey]) {
        groups[sportKey] = {}
      }

      if (!groups[sportKey][ageKey]) {
        groups[sportKey][ageKey] = []
      }

      groups[sportKey][ageKey].push(session)
    })

    Object.values(groups).forEach((ageGroups) => {
      Object.values(ageGroups).forEach((list) => {
        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      })
    })

    return groups
  }, [sessions])

  const groupedSportCount = Object.keys(groupedSessions).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/sessions" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Upcoming Training Sessions</h1>
            <p className="text-gray-600 mt-2">
              Browse by sport and age group to find the perfect fit for your athlete.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Showing {sessions.length} sessions{groupedSportCount ? ` across ${groupedSportCount} sports` : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading training sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No training sessions available at the moment.</p>
            <Link href="/contact">
              <Button variant="outline">Contact Coach Robe</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedSessions).sort(([a], [b]) => {
              const sportPriority = ['volleyball', 'basketball']
              const aIndex = sportPriority.indexOf(a.toLowerCase())
              const bIndex = sportPriority.indexOf(b.toLowerCase())
              const aRank = aIndex === -1 ? sportPriority.length : aIndex
              const bRank = bIndex === -1 ? sportPriority.length : bIndex
              return aRank - bRank
            }).map(([sport, ageGroups]) => (
              <section key={sport}>
                <header className="mb-6">
                  <h2 className="text-2xl font-semibold">
                    {sport.charAt(0).toUpperCase() + sport.slice(1)} Sessions
                  </h2>
                </header>

                <div className="space-y-8">
                  {Object.entries(ageGroups)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([ageGroup, groupSessions]) => (
                      <div key={`${sport}-${ageGroup}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-medium">{ageGroup}</h3>
                          <span className="text-sm text-gray-500">
                            {groupSessions.length} session{groupSessions.length === 1 ? '' : 's'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupSessions.map((session) => (
                            <SessionCard key={session.id} session={session} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-12 text-center space-y-6">
          <div>
            <p className="text-gray-600 mb-4">Don't see a session that fits your schedule?</p>
            <Link href="/contact">
              <Button variant="outline">Contact Coach Robe</Button>
            </Link>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-gray-600 mb-4">Need to cancel a registration?</p>
            <Link href="/cancel">
              <Button variant="outline">Cancel Registration</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
