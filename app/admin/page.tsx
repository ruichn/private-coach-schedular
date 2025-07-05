"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react"

const existingSessions = [
  {
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
  },
  {
    id: 2,
    ageGroup: "U14",
    subgroup: "Intermediate",
    date: "2024-01-16",
    time: "6:00 PM - 7:30 PM",
    location: "Elite Sports Center",
    address: "456 Sports Ave, New York, NY",
    maxParticipants: 10,
    currentParticipants: 10,
    price: 30,
    focus: "Serving & Passing Techniques",
    status: "full",
  },
]

export default function AdminPage() {
  const [sessions, setSessions] = useState(existingSessions)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    ageGroup: "",
    subgroup: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    maxParticipants: "",
    price: "",
    focus: "",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newSession = {
      id: sessions.length + 1,
      ageGroup: formData.ageGroup,
      subgroup: formData.subgroup,
      date: formData.date,
      time: `${formData.startTime} - ${formData.endTime}`,
      location: formData.location,
      address: formData.address,
      maxParticipants: Number.parseInt(formData.maxParticipants),
      currentParticipants: 0,
      price: Number.parseInt(formData.price),
      focus: formData.focus,
      status: "open",
    }

    setSessions((prev) => [...prev, newSession])
    setShowCreateForm(false)
    setFormData({
      ageGroup: "",
      subgroup: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      address: "",
      maxParticipants: "",
      price: "",
      focus: "",
      notes: "",
    })

    alert("Session created successfully!")
  }

  const deleteSession = (id: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions((prev) => prev.filter((session) => session.id !== id))
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "full":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const subgroupOptions = {
    U13: ["Beginners", "Intermediate"],
    U14: ["Beginners", "Intermediate", "Advanced"],
    U15: ["Developmental", "Competitive"],
    U16: ["Developmental", "Competitive", "Elite"],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Coach Robe Admin
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/sessions" className="text-sm font-medium hover:text-gray-600">
              View Sessions
            </Link>
            <Link href="/admin/participants" className="text-sm font-medium hover:text-gray-600">
              Participants
            </Link>
          </nav>
          <Button variant="outline" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Session Management</h1>
          <p className="text-gray-500">Managing {sessions.length} sessions</p>
        </div>

        {/* Create Session Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Training Session</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ageGroup">Age Group *</Label>
                    <Select value={formData.ageGroup} onValueChange={(value) => handleSelectChange("ageGroup", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="U13">U13</SelectItem>
                        <SelectItem value="U14">U14</SelectItem>
                        <SelectItem value="U15">U15</SelectItem>
                        <SelectItem value="U16">U16</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subgroup">Subgroup *</Label>
                    <Select
                      value={formData.subgroup}
                      onValueChange={(value) => handleSelectChange("subgroup", value)}
                      disabled={!formData.ageGroup}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subgroup" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.ageGroup &&
                          subgroupOptions[formData.ageGroup as keyof typeof subgroupOptions]?.map((subgroup) => (
                            <SelectItem key={subgroup} value={subgroup}>
                              {subgroup}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location Name *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Central High School Gym"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="e.g., 123 Main St, New York, NY"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxParticipants">Max Participants *</Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Player ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="focus">Session Focus *</Label>
                  <Input
                    id="focus"
                    name="focus"
                    placeholder="e.g., Basic Skills & Fundamentals"
                    value={formData.focus}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any special instructions or notes for participants"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Create Session</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {session.ageGroup} - {session.subgroup}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{session.focus}</p>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status === "open" ? "Open" : session.status === "full" ? "Full" : "Cancelled"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
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

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {session.currentParticipants}/{session.maxParticipants} players
                    </span>
                  </div>
                  <div className="font-bold text-lg">${session.price}</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => deleteSession(session.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
