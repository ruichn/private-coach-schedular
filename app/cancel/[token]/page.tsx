"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock, Calendar, MapPin, UserX } from "lucide-react"

interface RegistrationData {
  id: number
  playerName: string
  parentName: string
  parentEmail: string
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

export default function TokenCancellationPage() {
  const params = useParams()
  const token = params.token as string
  
  const [loading, setLoading] = useState(true)
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [cancelledDetails, setCancelledDetails] = useState<any>(null)

  useEffect(() => {
    if (token) {
      validateToken()
    }
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/cancel/${token}`)
      const data = await response.json()

      if (response.ok) {
        setRegistration(data.registration)
      } else {
        setError(data.error || 'Invalid cancellation link')
      }
    } catch (err) {
      setError('Failed to validate cancellation link')
    } finally {
      setLoading(false)
    }
  }

  const handleCancellation = async () => {
    if (!registration) return

    setCancelling(true)
    try {
      const response = await fetch(`/api/cancel/${token}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()

      if (response.ok) {
        setCancelled(true)
        setCancelledDetails(data)
      } else {
        setError(data.error || 'Failed to cancel registration')
      }
    } catch (err) {
      setError('Failed to cancel registration. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating cancellation link...</p>
        </div>
      </div>
    )
  }

  if (cancelled && cancelledDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="font-bold text-xl">
              Coach Robe Volleyball
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-800">Registration Cancelled</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-700">
                  <strong>{cancelledDetails.playerName}</strong>'s registration has been successfully cancelled.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-left">
                  <p className="font-medium mb-2">Cancelled Session:</p>
                  <p>{cancelledDetails.sessionDetails.ageGroup} - {cancelledDetails.sessionDetails.subgroup}</p>
                  <p>{formatDate(cancelledDetails.sessionDetails.date)} at {cancelledDetails.sessionDetails.time}</p>
                </div>
                
                <p className="text-sm text-gray-600">
                  If you have any questions, please contact Coach Robe at{" "}
                  <a href="mailto:Robe@PodioSports.org" className="text-blue-600 hover:underline">
                    Robe@PodioSports.org
                  </a>
                </p>
                
                <div className="pt-4 space-y-3">
                  <Link href="/sessions">
                    <Button className="w-full">View Other Sessions</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">Return Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="font-bold text-xl">
              Coach Robe Volleyball
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl text-red-800">Cancellation Error</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-700">{error}</p>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm">
                  <p className="text-yellow-800">
                    <strong>Alternative Options:</strong>
                  </p>
                  <ul className="text-yellow-700 mt-2 space-y-1">
                    <li>• Use the manual cancellation form</li>
                    <li>• Contact Coach Robe directly</li>
                    <li>• Check if you used the correct cancellation link</li>
                  </ul>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Link href="/cancel">
                    <Button className="w-full">Manual Cancellation</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">Contact Coach Robe</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">Return Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="font-bold text-xl">
            Coach Robe Volleyball
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Cancel Registration</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Confirm cancellation for the following registration
              </p>
            </CardHeader>
            
            {registration && (
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">Player</p>
                    <p className="text-sm text-gray-600">{registration.playerName}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">Parent/Guardian</p>
                    <p className="text-sm text-gray-600">{registration.parentName}</p>
                    <p className="text-sm text-gray-500">{registration.parentEmail}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">Session</p>
                    <p className="text-sm text-gray-600">{registration.session.ageGroup} - {registration.session.subgroup}</p>
                    <p className="text-sm text-gray-500">{registration.session.focus}</p>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(registration.session.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{registration.session.time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{registration.session.location}</span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> This action cannot be undone. The cancellation link will become invalid after use.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleCancellation} 
                    disabled={cancelling}
                    variant="destructive"
                    className="w-full"
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </Button>
                  
                  <Link href="/sessions">
                    <Button variant="outline" className="w-full">
                      Keep Registration & View Sessions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}