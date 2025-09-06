"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Clock, MapPin } from "lucide-react"
import SessionSignupForm from "@/components/session-signup-form"
import { formatSessionDate } from "@/lib/date-utils"

interface SessionData {
  id: number
  sport: string
  ageGroup: string
  date: Date
  time: string
  location: string
  address: string
  maxParticipants: number
  currentParticipants: number
  price: number
  focus: string
  status: string
  registrations?: {
    playerName: string
    playerAge: number
    parentName: string
  }[]
}

interface DynamicSessionSignupProps {
  initialSession: SessionData
}

export default function DynamicSessionSignup({ initialSession }: DynamicSessionSignupProps) {
  const [session, setSession] = useState<SessionData>(initialSession)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUpdatedSession = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/sessions/${session.id}`)
      if (response.ok) {
        const updatedSession = await response.json()
        setSession({
          ...updatedSession,
          currentParticipants: updatedSession.registrations?.length || updatedSession.currentParticipants,
          date: new Date(updatedSession.date)
        })
      }
    } catch (error) {
      console.error('Error fetching updated session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegistrationSuccess = () => {
    // Refresh session data after successful registration
    fetchUpdatedSession()
  }

  const spotsRemaining = session.maxParticipants - session.currentParticipants

  if (spotsRemaining <= 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Session Full</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Sorry, this training session is currently full. Please check back later or browse other available sessions.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Session Details
                {isLoading && <div className="text-sm text-gray-500">Updating...</div>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {session.sport?.charAt(0).toUpperCase() + session.sport?.slice(1)} - {session.ageGroup}
                </h3>
                <p className="text-gray-600">{session.focus}</p>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{formatSessionDate(session.date.toISOString().split('T')[0])}</span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{session.time}</span>
              </div>

              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">{session.location}</div>
                  <div className="text-gray-500">{session.address}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {session.currentParticipants}/{session.maxParticipants} players
                  </span>
                </div>
                {session.price > 0 && (
                  <div className="font-bold text-xl">${session.price}</div>
                )}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Available spots:</span>
                <Badge variant={spotsRemaining <= 3 ? "destructive" : "secondary"}>
                  {spotsRemaining} remaining
                </Badge>
              </div>

              {session.registrations && session.registrations.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Current Participants:</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {session.registrations.map((registration, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{registration.playerName}</span>
                        {registration.playerAge && (
                          <span className="text-gray-500"> (Age {registration.playerAge})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Player Registration</CardTitle>
              <p className="text-gray-600">Fill out the form below to register for this training session.</p>
            </CardHeader>
            <CardContent>
              <SessionSignupForm 
                sessionId={session.id} 
                sessionPrice={session.price}
                onRegistrationSuccess={handleRegistrationSuccess}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}