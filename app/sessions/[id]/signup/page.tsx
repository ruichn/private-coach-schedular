"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"

// Mock data - in a real app, this would come from your database
const sessionData = {
  1: {
    id: 1,
    ageGroup: "U13",
    subgroup: "Beginners",
    date: "2024-01-15",
    time: "4:00 PM - 5:30 PM",
    location: "Central High School Gym",
    address: "123 Main St, New York, NY",
    maxParticipants: 12,
    currentParticipants: 8,
    price: 25,
    focus: "Basic Skills & Fundamentals",
    status: "open",
    participants: [
      { name: "Emma Johnson", age: 12, parent: "Sarah Johnson", phone: "(555) 123-4567" },
      { name: "Olivia Smith", age: 13, parent: "Mike Smith", phone: "(555) 234-5678" },
      { name: "Ava Brown", age: 12, parent: "Lisa Brown", phone: "(555) 345-6789" },
      { name: "Isabella Davis", age: 13, parent: "Tom Davis", phone: "(555) 456-7890" },
      { name: "Sophia Wilson", age: 12, parent: "Amy Wilson", phone: "(555) 567-8901" },
      { name: "Mia Garcia", age: 13, parent: "Carlos Garcia", phone: "(555) 678-9012" },
      { name: "Charlotte Martinez", age: 12, parent: "Maria Martinez", phone: "(555) 789-0123" },
      { name: "Amelia Anderson", age: 13, parent: "John Anderson", phone: "(555) 890-1234" },
    ],
  },
}

export default function SessionSignup({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    playerName: "",
    playerAge: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalInfo: "",
    experience: "",
    specialNotes: "",
  })

  const sessionId = Number.parseInt(params.id)
  const session = sessionData[sessionId as keyof typeof sessionData]

  if (!session) {
    return <div>Session not found</div>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit this data to your backend
    console.log("Registration data:", formData)
    alert("Registration submitted successfully! Coach Robe will contact you to confirm.")
  }

  const spotsRemaining = session.maxParticipants - session.currentParticipants

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
            <Link href="/coaches" className="text-sm font-medium hover:text-gray-600">
              Programs
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-gray-600">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/sessions" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Session Details
                  <Badge className="bg-green-100 text-green-800">{spotsRemaining} spots left</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {session.ageGroup} - {session.subgroup}
                  </h3>
                  <p className="text-gray-600">{session.focus}</p>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formatDate(session.date)}</span>
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
                  <div className="font-bold text-xl">${session.price}</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Current Participants:</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {session.participants.map((participant, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{participant.name}</span>
                        <span className="text-gray-500"> (Age {participant.age})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Player Registration</CardTitle>
                <p className="text-gray-600">Fill out the form below to register for this training session.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Player Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Player Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="playerName">Player Name *</Label>
                        <Input
                          id="playerName"
                          name="playerName"
                          value={formData.playerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="playerAge">Player Age *</Label>
                        <Input
                          id="playerAge"
                          name="playerAge"
                          type="number"
                          min="10"
                          max="18"
                          value={formData.playerAge}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="experience">Volleyball Experience</Label>
                      <Textarea
                        id="experience"
                        name="experience"
                        placeholder="Describe the player's volleyball experience (beginner, played for 1 year, etc.)"
                        value={formData.experience}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Parent/Guardian Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Parent/Guardian Information</h3>

                    <div>
                      <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                      <Input
                        id="parentName"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentEmail">Email Address *</Label>
                        <Input
                          id="parentEmail"
                          name="parentEmail"
                          type="email"
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="parentPhone">Phone Number *</Label>
                        <Input
                          id="parentPhone"
                          name="parentPhone"
                          type="tel"
                          value={formData.parentPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Emergency Contact</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Emergency Phone *</Label>
                        <Input
                          id="emergencyPhone"
                          name="emergencyPhone"
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Medical Information</h3>

                    <div>
                      <Label htmlFor="medicalInfo">Medical Conditions/Allergies</Label>
                      <Textarea
                        id="medicalInfo"
                        name="medicalInfo"
                        placeholder="Please list any medical conditions, allergies, or medications the coach should be aware of"
                        value={formData.medicalInfo}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialNotes">Special Notes</Label>
                      <Textarea
                        id="specialNotes"
                        name="specialNotes"
                        placeholder="Any additional information or special requests"
                        value={formData.specialNotes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Session Fee:</span>
                      <span className="text-2xl font-bold">${session.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Payment will be collected at the session. Please bring exact change or be prepared to pay via
                      Venmo/Zelle.
                    </p>
                    <Button type="submit" className="w-full" size="lg">
                      Register for Session
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
