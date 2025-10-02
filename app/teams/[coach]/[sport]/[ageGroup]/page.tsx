"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
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

export default function CoachSportAgeGroupPage() {
  const params = useParams()
  const coach = decodeURIComponent(params.coach as string)
  const sport = decodeURIComponent(params.sport as string)
  const ageGroup = decodeURIComponent(params.ageGroup as string)

  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [coach, sport, ageGroup])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        // Filter sessions by coach, sport and age group
        const filtered = data.filter(
          (session: Session) =>
            session.sport.toLowerCase() === sport.toLowerCase() &&
            session.ageGroup === ageGroup
            // TODO: Add coach filtering when coach field is added to Session model
        )
        // Sort by date
        filtered.sort((a: Session, b: Session) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        setSessions(filtered)
      } else {
        console.error('Failed to fetch sessions, status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/sessions" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                {sport.charAt(0).toUpperCase() + sport.slice(1)} - {ageGroup}
              </h1>
              <p className="text-gray-600 mt-2">
                Coach {coach.charAt(0).toUpperCase() + coach.slice(1)} - {ageGroup} players
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {sessions.length} session{sessions.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading training sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No training sessions available for this group at the moment.</p>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
