"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, UserX } from "lucide-react"

export default function CancelPage() {
  const [formData, setFormData] = useState({
    sessionId: "",
    playerName: "",
    parentEmail: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [availableSessions, setAvailableSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const sessions = await response.json()
        // Only show sessions that have registrations
        const sessionsWithRegistrations = sessions.filter((session: any) => 
          session.currentParticipants > 0 || session.registrations?.length > 0
        )
        setAvailableSessions(sessionsWithRegistrations)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch sessions when component mounts
  useEffect(() => {
    fetchSessions()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    // Don't update if it's a disabled placeholder value
    if (value === "loading" || value === "no-sessions") return
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    if (!formData.sessionId || !formData.playerName || !formData.parentEmail) {
      setResult({ type: 'error', message: 'Please fill in all fields' })
      setIsSubmitting(false)
      return
    }

    try {
      const params = new URLSearchParams({
        email: formData.parentEmail,
        playerName: formData.playerName
      })

      const response = await fetch(`/api/sessions/${formData.sessionId}/registrations?${params}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ 
          type: 'success', 
          message: `Registration for ${data.playerName} has been cancelled successfully.` 
        })
        setFormData({ sessionId: "", playerName: "", parentEmail: "" })
        // Refresh sessions to show updated participant counts
        fetchSessions()
      } else {
        setResult({ type: 'error', message: data.error || 'Failed to cancel registration' })
      }
    } catch (error) {
      setResult({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Coach Robe Volleyball
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/sessions" className="text-sm font-medium hover:text-gray-600">
              Sessions
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-gray-600">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-gray-600">
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Cancel Registration</h1>
            <p className="text-gray-600">
              Need to cancel a volleyball training session registration? Enter your details below.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cancellation Form</CardTitle>
            </CardHeader>
            <CardContent>
              {result && (
                <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
                  result.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {result.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <p className={result.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {result.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="sessionId">Training Session *</Label>
                  <Select value={formData.sessionId} onValueChange={(value) => handleSelectChange("sessionId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the session you registered for" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>Loading sessions...</SelectItem>
                      ) : availableSessions.length === 0 ? (
                        <SelectItem value="no-sessions" disabled>No sessions with registrations found</SelectItem>
                      ) : (
                        availableSessions.map((session) => (
                          <SelectItem key={session.id} value={session.id.toString()}>
                            {session.ageGroup} - {session.subgroup} • {formatDate(session.date)} • {session.time}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="playerName">Player Name *</Label>
                  <Input
                    id="playerName"
                    name="playerName"
                    value={formData.playerName}
                    onChange={handleInputChange}
                    placeholder="Enter the player's full name"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Must match exactly as entered during registration
                  </p>
                </div>

                <div>
                  <Label htmlFor="parentEmail">Parent Email *</Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    placeholder="Enter the parent/guardian email used for registration"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Must match the email used during registration
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important Notes:</p>
                      <ul className="space-y-1">
                        <li>• Registration cancellations are processed immediately</li>
                        <li>• Please contact Coach Robe for refund policies</li>
                        <li>• Cancellation at least 24 hours before session is recommended</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || availableSessions.length === 0}
                    className="flex-1"
                    variant="destructive"
                  >
                    {isSubmitting ? 'Cancelling...' : 'Cancel Registration'}
                  </Button>
                  <Link href="/sessions" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Back to Sessions
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Need help with cancellation?</p>
            <Link href="/contact">
              <Button variant="outline">Contact Coach Robe</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}