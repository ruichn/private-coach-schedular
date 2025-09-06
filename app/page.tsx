"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, ArrowRight, MapPin, Clock } from "lucide-react"
import { formatSessionDateShort } from "@/lib/date-utils"

interface Session {
  id: number
  ageGroup: string
  subgroup: string
  date: string
  time: string
  location: string
  participants: number
  maxParticipants: number
  spotsLeft: number
  price: number
  focus: string
}

export default function Home() {
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingSessions()
  }, [])

  const fetchUpcomingSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const sessions = await response.json()
        // Take first 3 sessions and format for homepage
        const formatted = sessions.slice(0, 3).map((session: any) => ({
          id: session.id,
          ageGroup: session.ageGroup,
          subgroup: session.subgroup,
          date: formatSessionDateShort(session.date),
          time: session.time,
          location: session.location,
          participants: session.currentParticipants,
          maxParticipants: session.maxParticipants,
          spotsLeft: session.maxParticipants - session.currentParticipants,
          price: session.price,
          focus: session.focus,
        }))
        setUpcomingSessions(formatted)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Coach Robe Volleyball
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/sessions" className="text-sm font-medium hover:text-gray-600">
              Sessions
            </Link>
            <Link href="/cancel" className="text-sm font-medium hover:text-gray-600">
              Cancel Registration
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-gray-600">
              Contact
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-gray-600">
              About
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

      <main>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Elite Volleyball Training with Coach Robe</h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Professional volleyball coaching for youth players. Specialized group training sessions organized by age
              groups U13-U16. Develop your skills, teamwork, and competitive edge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sessions">
                <Button size="lg" className="w-full sm:w-auto">
                  View Training Sessions
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Learn About Coach Robe
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Upcoming Sessions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {loading ? (
                // Loading skeleton
                [...Array(3)].map((_, i) => (
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
                ))
              ) : upcomingSessions.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">No upcoming sessions available.</p>
                </div>
              ) : (
                upcomingSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {session.ageGroup} - {session.subgroup}
                        </CardTitle>
                        <CardDescription>{session.focus}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{session.spotsLeft} spots left</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {session.participants}/{session.maxParticipants} players
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    {session.price > 0 ? (
                      <div className="font-bold">${session.price}</div>
                    ) : (
                      <div></div>
                    )}
                    <Link href={`/sessions/${session.id}/signup`}>
                      <Button>
                        Sign Up
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <Link href="/sessions">
                <Button variant="outline" size="lg">
                  View All Sessions
                </Button>
              </Link>
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

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join our volleyball programs and elevate your game with expert coaching from Coach Robe.
            </p>
            <Link href="/sessions">
              <Button size="lg">Find Your Training Today</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Coach Robe Volleyball</h3>
              <p className="text-gray-400">Professional volleyball training for youth athletes in the New York area.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/sessions" className="text-gray-400 hover:text-white">
                    Training Sessions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Coach Robe
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Age Groups</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/sessions?age=U13" className="text-gray-400 hover:text-white">
                    U13 Training
                  </Link>
                </li>
                <li>
                  <Link href="/sessions?age=U14" className="text-gray-400 hover:text-white">
                    U14 Training
                  </Link>
                </li>
                <li>
                  <Link href="/sessions?age=U15" className="text-gray-400 hover:text-white">
                    U15 Training
                  </Link>
                </li>
                <li>
                  <Link href="/sessions?age=U16" className="text-gray-400 hover:text-white">
                    U16 Training
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Coach Robe Volleyball. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

