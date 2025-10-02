"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, ArrowRight, MapPin, Clock, CalendarPlus } from "lucide-react"
import { formatSessionDateShort } from "@/lib/date-utils"
import Navigation from "@/components/ui/navigation"
import { AddToCalendar } from "@/components/ui/add-to-calendar"

interface Session {
  id: number
  sport: string
  ageGroup: string
  date: string
  originalDate: string
  time: string
  location: string
  address: string
  participants: number
  maxParticipants: number
  spotsLeft: number
  price: number
  focus: string
}

export default function Home() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingSessions()
  }, [])

  const fetchUpcomingSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const sessions = await response.json()
        const formatted = sessions.map((session: any) => ({
          id: session.id,
          sport: session.sport || 'volleyball', // Default to volleyball for existing sessions
          ageGroup: session.ageGroup,
          date: formatSessionDateShort(session.date),
          originalDate: session.date, // Keep original date for calendar
          time: session.time,
          location: session.location,
          address: session.address,
          participants: session.currentParticipants,
          maxParticipants: session.maxParticipants,
          spotsLeft: session.maxParticipants - session.currentParticipants,
          price: session.price,
          focus: session.focus,
        }))
        setSessions(formatted)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const sportPriority = ['volleyball', 'basketball']
  const getSportRank = (sport: string) => {
    const index = sportPriority.indexOf(sport.toLowerCase())
    return index === -1 ? sportPriority.length : index
  }

  const representativeSessions = useMemo(() => {
    if (sessions.length === 0) return []

    const grouped = sessions.reduce<Record<string, Session>>((acc, session) => {
      const key = `${session.sport}__${session.ageGroup}`
      const existing = acc[key]
      const currentDate = new Date(session.originalDate).getTime()

      if (!existing) {
        acc[key] = session
      } else {
        const existingDate = new Date(existing.originalDate).getTime()
        if (currentDate < existingDate) {
          acc[key] = session
        }
      }

      return acc
    }, {})

    return Object.values(grouped).sort((a, b) => {
      const sportRankDiff = getSportRank(a.sport) - getSportRank(b.sport)
      if (sportRankDiff !== 0) return sportRankDiff
      return a.ageGroup.localeCompare(b.ageGroup)
    })
  }, [sessions])

  const representativesBySport = useMemo(() => {
    return representativeSessions.reduce<Record<string, Session[]>>((acc, session) => {
      if (!acc[session.sport]) {
        acc[session.sport] = []
      }
      acc[session.sport].push(session)
      return acc
    }, {})
  }, [representativeSessions])
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation currentPage="/" />

      <main>
        <section className="pt-12 pb-6 md:pt-16 md:pb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Elite Sports Training with Coach Robe</h1>
            <p className="text-xl text-gray-600 mb-0 max-w-3xl mx-auto">
              Professional volleyball and basketball coaching for youth players. Specialized group training sessions for ages
              U12-U16. Develop your skills, teamwork, and competitive edge in both sports.
            </p>
          </div>
        </section>

        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Upcoming Sessions</h2>

            <div className="space-y-10">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="animate-pulse space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : representativeSessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No upcoming sessions available.</p>
                </div>
              ) : (
                Object.entries(representativesBySport)
                  .sort(([a], [b]) => {
                    const rankDiff = getSportRank(a) - getSportRank(b)
                    if (rankDiff !== 0) return rankDiff
                    return a.localeCompare(b)
                  })
                  .map(([sport, sportSessions]) => (
                    <section key={sport} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold">
                          {sport.charAt(0).toUpperCase() + sport.slice(1)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {sportSessions.length} age group{sportSessions.length === 1 ? '' : 's'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sportSessions.map((session) => {
                          const mapQuery = [session.location, session.address].filter(Boolean).join(' ')
                          const mapLink = mapQuery
                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
                            : null

                          return (
                            <Card
                              key={`${session.sport}-${session.ageGroup}`}
                              className="overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">
                                      {session.sport?.charAt(0).toUpperCase() + session.sport?.slice(1)} - {session.ageGroup}
                                    </CardTitle>
                                    {session.price > 0 && (
                                      <div className="font-bold mt-1">${session.price}</div>
                                    )}
                                    <CardDescription>{session.focus}</CardDescription>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/sessions/${session.id}/signup`)
                                      }}
                                    >
                                      Sign Up
                                      <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Badge className="bg-green-100 text-green-800">{session.spotsLeft} spots left</Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div onClick={(e) => e.stopPropagation()}>
                                  <AddToCalendar
                                    session={{
                                      id: session.id,
                                      sport: session.sport,
                                      ageGroup: session.ageGroup,
                                      date: session.originalDate,
                                      time: session.time,
                                      location: session.location,
                                      address: session.address,
                                      focus: session.focus,
                                      price: session.price
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full h-auto items-start justify-start px-0 py-0 text-left transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                  >
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center text-sm">
                                        <CalendarPlus className="h-4 w-4 mr-2 text-blue-600" />
                                        <span>{session.date}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span>{session.time}</span>
                                      </div>
                                    </div>
                                  </AddToCalendar>
                                </div>

                                <div className="flex items-start text-sm">
                                  <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                  {mapLink ? (
                                    <a
                                      href={mapLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-blue-600 hover:underline"
                                      title="View location in Google Maps"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {session.location}
                                      {session.address && (
                                        <span className="block text-gray-500">{session.address}</span>
                                      )}
                                    </a>
                                  ) : (
                                    <span>{session.location}</span>
                                  )}
                                </div>

                                <div className="flex items-center text-sm">
                                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>
                                    {session.participants}/{session.maxParticipants} players
                                  </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${(session.participants / session.maxParticipants) * 100}%` }}
                                  ></div>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/teams/robe/${encodeURIComponent(session.sport)}/${encodeURIComponent(session.ageGroup)}`)
                                  }}
                                >
                                  View All Sessions
                                </Button>
                              </CardFooter>
                            </Card>
                          )
                        })}
                      </div>
                    </section>
                  ))
              )}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Browse Sessions</h3>
                <p className="text-gray-600">
                  View available training sessions organized by age group and skill level. Each session shows time,
                  location, and available spots.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Sign Up Online</h3>
                <p className="text-gray-600">
                  Complete the registration form with player and parent information. Secure your spot in the session.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Train & Improve</h3>
                <p className="text-gray-600">
                  Attend the session at the specified location and time. Payment is collected on-site.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cancel Registration Section */}
        <section className="py-12 bg-red-50 border-t border-red-100">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4 text-red-800">Need to Cancel a Registration?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              If you need to cancel your training session registration, you can do so easily through our cancellation system.
              <br />
              <span className="text-sm text-red-600 font-medium">Note: Cancellations must be made at least 24 hours before the session.</span>
            </p>
            <Link href="/cancel">
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                Cancel Registration
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Coach Robe
            </div>
            <div className="flex items-center gap-6">
              <Link href="https://www.podiosports.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white hover:opacity-80 transition-opacity">
                <Image
                  src="/images/podio-sports-icon.png"
                  alt="Podio Sports"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg"
                />
                <span className="font-semibold text-lg">Podio Sports</span>
              </Link>
              <Link href="https://www.instagram.com/_podio.sports_/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
