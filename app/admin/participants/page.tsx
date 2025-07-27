"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAdminAuthenticated, useAdminAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Mail, Phone, User } from "lucide-react"

interface Registration {
  id: number
  playerName: string
  playerAge: number | null
  parentName: string
  parentEmail: string
  parentPhone: string
  emergencyContact: string | null
  emergencyPhone: string | null
  medicalInfo: string | null
  experience: string | null
  specialNotes: string | null
  createdAt: string
  session: {
    id: number
    ageGroup: string
    subgroup: string
    date: string
    time: string
    location: string
    focus: string
  }
}

export default function ParticipantsPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAdminAuth()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  // Check authentication on component mount
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
  }, [router])

  useEffect(() => {
    if (isAdminAuthenticated()) {
      fetchRegistrations()
    }
  }, [])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations')
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data)
      } else {
        console.error('Failed to fetch registrations')
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatRegistrationDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="font-bold text-xl">
            Coach Robe Admin
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium hover:text-gray-600">
              Sessions
            </Link>
            <Link href="/admin/participants" className="text-sm font-medium text-blue-600">
              Participants
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline">Back to Admin</Button>
            </Link>
            <Button variant="ghost" onClick={logout} className="text-red-600 hover:text-red-700">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Participant Management</h1>
            <p className="text-gray-600 mt-2">View and manage all session registrations</p>
          </div>
          <div className="text-right">
            {loading ? (
              <p className="text-sm text-gray-500">Loading registrations...</p>
            ) : (
              <p className="text-sm text-gray-500">{registrations.length} total registrations</p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading participants...</p>
          </div>
        ) : registrations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Registrations Yet</h3>
              <p className="text-gray-500">No players have registered for sessions yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration) => (
              <Card key={registration.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        {registration.playerName}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {registration.playerAge ? `Age: ${registration.playerAge}` : 'Age: Not provided'} • Registered: {formatRegistrationDate(registration.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {registration.session.ageGroup} - {registration.session.subgroup}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Session Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Session Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{formatDate(registration.session.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{registration.session.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{registration.session.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Focus: </span>
                        <span className="ml-1">{registration.session.focus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Parent/Guardian Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Parent/Guardian</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{registration.parentName}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <a href={`mailto:${registration.parentEmail}`} className="text-blue-600 hover:underline">
                            {registration.parentEmail}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <a href={`tel:${registration.parentPhone}`} className="text-blue-600 hover:underline">
                            {registration.parentPhone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Emergency Contact</h4>
                      <div className="space-y-1 text-sm">
                        {registration.emergencyContact ? (
                          <>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{registration.emergencyContact}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <a href={`tel:${registration.emergencyPhone}`} className="text-blue-600 hover:underline">
                                {registration.emergencyPhone}
                              </a>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500 italic">No emergency contact provided</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {(registration.experience || registration.medicalInfo || registration.specialNotes) && (
                    <div>
                      <h4 className="font-medium mb-2">Additional Information</h4>
                      <div className="space-y-2 text-sm">
                        {registration.experience && (
                          <div>
                            <span className="font-medium">Experience: </span>
                            <span>{registration.experience}</span>
                          </div>
                        )}
                        {registration.medicalInfo && (
                          <div>
                            <span className="font-medium">Medical Info: </span>
                            <span>{registration.medicalInfo}</span>
                          </div>
                        )}
                        {registration.specialNotes && (
                          <div>
                            <span className="font-medium">Special Notes: </span>
                            <span>{registration.specialNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}