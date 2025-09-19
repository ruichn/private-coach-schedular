"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAdminAuthenticated, useAdminAuth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Mail, Phone, Download, Search, Filter, FileText, ArrowLeft, Grid, List, User, Edit, Trash2 } from "lucide-react"
import { formatSessionDate } from "@/lib/date-utils"
import AdminNavigation from "@/components/ui/admin-navigation"

interface BaseRegistration {
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
}

interface Registration extends BaseRegistration {
  session: {
    id: number
    sport: string
    ageGroup: string
    date: string
    time: string
    location: string
    address: string
    focus: string
    price: number
    maxParticipants: number
  }
}

interface SessionWithRegistrations {
  id: number
  sport: string
  ageGroup: string
  date: string
  time: string
  location: string
  address: string
  maxParticipants: number
  price: number
  focus: string
  registrations: BaseRegistration[]
}

type ViewMode = 'by-session' | 'all-participants'

export default function ParticipantsPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAdminAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('by-session')
  const [sessions, setSessions] = useState<SessionWithRegistrations[]>([])
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sportFilter, setSportFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [editingParticipant, setEditingParticipant] = useState<BaseRegistration | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editFormData, setEditFormData] = useState({
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

  // Check authentication on component mount
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
  }, [router])

  // Fetch data
  useEffect(() => {
    if (isAdminAuthenticated()) {
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      // Fetch sessions with registrations for by-session view
      const sessionsResponse = await fetch('/api/sessions?includeHidden=true', {
        credentials: 'include'
      })
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        setSessions(sessionsData)

        // Extract all registrations from sessions data for all-participants view
        const allRegistrationsFromSessions: Registration[] = []
        sessionsData.forEach((session: SessionWithRegistrations) => {
          if (session.registrations) {
            session.registrations.forEach((reg: BaseRegistration) => {
              allRegistrationsFromSessions.push({
                ...reg,
                session: {
                  id: session.id,
                  sport: session.sport,
                  ageGroup: session.ageGroup,
                  date: session.date,
                  time: session.time,
                  location: session.location,
                  address: session.address,
                  focus: session.focus,
                  price: session.price,
                  maxParticipants: session.maxParticipants
                }
              })
            })
          }
        })
        console.log('Extracted registrations from sessions:', allRegistrationsFromSessions.length, 'registrations')
        setAllRegistrations(allRegistrationsFromSessions)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle editing a participant
  const handleEditParticipant = (registration: BaseRegistration) => {
    setEditingParticipant(registration)
    setEditFormData({
      playerName: registration.playerName || "",
      playerAge: registration.playerAge?.toString() || "",
      parentName: registration.parentName || "",
      parentEmail: registration.parentEmail || "",
      parentPhone: registration.parentPhone || "",
      emergencyContact: registration.emergencyContact || "",
      emergencyPhone: registration.emergencyPhone || "",
      medicalInfo: registration.medicalInfo || "",
      experience: registration.experience || "",
      specialNotes: registration.specialNotes || "",
    })
    setShowEditForm(true)
  }

  // Handle deleting a participant
  const handleDeleteParticipant = async (registrationId: number) => {
    if (!confirm('Are you sure you want to delete this participant registration? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        // Refresh data after successful deletion
        await fetchData()
        console.log('Participant deleted successfully')
      } else {
        const error = await response.json()
        alert(`Failed to delete participant: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting participant:', error)
      alert('Failed to delete participant. Please try again.')
    }
  }

  // Handle saving edited participant
  const handleSaveParticipant = async () => {
    if (!editingParticipant) return

    try {
      const updatedData = {
        ...editFormData,
        playerAge: editFormData.playerAge ? parseInt(editFormData.playerAge) : null
      }

      const response = await fetch(`/api/registrations/${editingParticipant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        // Refresh data after successful update
        await fetchData()
        setShowEditForm(false)
        setEditingParticipant(null)
        console.log('Participant updated successfully')
      } else {
        const error = await response.json()
        alert(`Failed to update participant: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating participant:', error)
      alert('Failed to update participant. Please try again.')
    }
  }

  // Handle form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Date filtering function - defined here to avoid hoisting issues
  const filterByDate = (sessionDateString: string) => {
    try {
      // Validate and parse the date string
      if (!sessionDateString) {
        console.warn('Empty date string provided to filterByDate')
        return false
      }

      // Parse the date string - handle both ISO format and simple date format
      let sessionDate
      if (sessionDateString.includes('T')) {
        // Already in ISO format (e.g., "2025-09-20T00:00:00.000Z")
        sessionDate = new Date(sessionDateString)
      } else {
        // Simple date format (e.g., "2025-09-20")
        sessionDate = new Date(sessionDateString + 'T00:00:00')
      }
      
      // Check if the date is valid
      if (isNaN(sessionDate.getTime())) {
        console.warn('Invalid date string:', sessionDateString)
        return false
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)


      switch (dateFilter) {
        case "today":
          return sessionDate.toDateString() === today.toDateString()
        case "tomorrow":
          return sessionDate.toDateString() === tomorrow.toDateString()
        case "this-week":
          return sessionDate >= today && sessionDate <= nextWeek
        case "past":
          return sessionDate < today
        case "future":
          return sessionDate > today
        default:
          return true
      }
    } catch (error) {
      console.error('Error in filterByDate:', error, 'Date string:', sessionDateString)
      return false
    }
  }

  // Filter sessions based on search and filters (for by-session view)
  const filteredSessions = sessions.filter(session => {
    // Initialize registrations array if undefined
    const registrations = session.registrations || []

    // Search logic: if no search term, always match; otherwise check registrations AND session details
    const matchesPlayerSearch = registrations.length > 0 && registrations.some(reg => 
      reg.playerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parentEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesSessionSearch = 
      session.ageGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSearch = searchTerm === "" || matchesPlayerSearch || matchesSessionSearch

    const matchesSport = sportFilter === "all" || session.sport === sportFilter
    const matchesDate = dateFilter === "all" || filterByDate(session.date)

    const result = matchesSearch && matchesSport && matchesDate
    

    return result
  })

  // Filter registrations (for all-participants view)
  const filteredRegistrations = allRegistrations.filter(registration => {
    if (!registration.session) {
      return false
    }

    const matchesSearch = searchTerm === "" ||
      registration.playerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.parentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.session.ageGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.session.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSport = sportFilter === "all" || registration.session.sport === sportFilter
    const matchesDate = dateFilter === "all" || filterByDate(registration.session.date)

    return matchesSearch && matchesSport && matchesDate
  })

  console.log('All registrations:', allRegistrations.length, 'Filtered registrations:', filteredRegistrations.length, 'View mode:', viewMode)

  const exportAllData = () => {
    if (viewMode === 'by-session') {
      // Export by session format
      const allData = filteredSessions.map(session => {
        const sessionInfo = `${session.sport?.charAt(0).toUpperCase() + session.sport?.slice(1)} - ${session.ageGroup}
${formatSessionDate(session.date)} at ${session.time}
${session.location} - ${session.address}
Price: ${session.price > 0 ? `$${session.price}` : 'Free'}

REGISTERED PLAYERS (${session.registrations?.length || 0}/${session.maxParticipants}):

${(session.registrations || []).map((reg, i) => 
`${i + 1}. ${reg.playerName}${reg.playerAge ? ` (${reg.playerAge}y)` : ''}
   Parent: ${reg.parentName}
   Email: ${reg.parentEmail}
   Phone: ${reg.parentPhone}${reg.experience ? `
   Experience: ${reg.experience}` : ''}${reg.medicalInfo ? `
   Medical: ${reg.medicalInfo}` : ''}${reg.emergencyContact ? `
   Emergency: ${reg.emergencyContact} ${reg.emergencyPhone || ''}` : ''}${reg.specialNotes ? `
   Notes: ${reg.specialNotes}` : ''}
`).join('\n')}

${'='.repeat(80)}`
      }).join('\n\n')

      const fullReport = `COACH ROBE SPORTS TRAINING - PARTICIPANTS BY SESSION
Generated: ${new Date().toLocaleString()}

Total Sessions: ${filteredSessions.length}
Total Participants: ${filteredSessions.reduce((sum, s) => sum + (s.registrations?.length || 0), 0)}

${'='.repeat(80)}

${allData}`

      const blob = new Blob([fullReport], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `participants-by-session-${new Date().toISOString().split('T')[0]}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // Export all participants format
      const participantData = `COACH ROBE SPORTS TRAINING - ALL PARTICIPANTS
Generated: ${new Date().toLocaleString()}

Total Participants: ${filteredRegistrations.length}

${'='.repeat(80)}

${filteredRegistrations.map((reg, i) => 
`${i + 1}. ${reg.playerName}${reg.playerAge ? ` (${reg.playerAge}y)` : ''}
   Session: ${reg.session.sport?.charAt(0).toUpperCase() + reg.session.sport?.slice(1)} - ${reg.session.ageGroup}
   Date: ${formatSessionDate(reg.session.date)} at ${reg.session.time}
   Location: ${reg.session.location}
   Parent: ${reg.parentName}
   Email: ${reg.parentEmail}
   Phone: ${reg.parentPhone}${reg.experience ? `
   Experience: ${reg.experience}` : ''}${reg.medicalInfo ? `
   Medical: ${reg.medicalInfo}` : ''}${reg.emergencyContact ? `
   Emergency: ${reg.emergencyContact} ${reg.emergencyPhone || ''}` : ''}${reg.specialNotes ? `
   Notes: ${reg.specialNotes}` : ''}
   Registered: ${new Date(reg.createdAt).toLocaleDateString()}

${'─'.repeat(40)}`
).join('\n\n')}`

      const blob = new Blob([participantData], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `all-participants-${new Date().toISOString().split('T')[0]}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const getStatusColor = (session: SessionWithRegistrations) => {
    const isFull = session.registrations?.length >= session.maxParticipants
    const sessionDate = new Date(session.date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isPast = sessionDate < today
    
    if (isPast) return "bg-gray-100 text-gray-800"
    if (isFull) return "bg-red-100 text-red-800"
    return "bg-green-100 text-green-800"
  }

  const getStatusText = (session: SessionWithRegistrations) => {
    const isFull = session.registrations?.length >= session.maxParticipants
    const sessionDate = new Date(session.date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isPast = sessionDate < today
    
    if (isPast) return "Completed"
    if (isFull) return "Full"
    return "Open"
  }

  const formatRegistrationDate = (dateString: string) => {
    try {
      if (!dateString) return 'Unknown'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    } catch (error) {
      console.error('Error formatting registration date:', error, dateString)
      return 'Invalid Date'
    }
  }

  const currentData = viewMode === 'by-session' ? filteredSessions : filteredRegistrations
  const hasData = currentData.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation currentPage="/admin/participants" onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Participants</h1>
            <p className="text-gray-600 mt-2">View and manage all registered players</p>
          </div>
          
          {hasData && (
            <Button onClick={exportAllData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          )}
        </div>

        {/* View Mode Toggle */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'by-session' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('by-session')}
                  className="flex items-center gap-2"
                >
                  <Grid className="h-4 w-4" />
                  By Session
                </Button>
                <Button
                  variant={viewMode === 'all-participants' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('all-participants')}
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  All Participants
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search players, parents, sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="future">Future Sessions</SelectItem>
                  <SelectItem value="past">Past Sessions</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {viewMode === 'by-session' 
                  ? `${filteredSessions.length} sessions, ${filteredSessions.reduce((sum, s) => sum + (s.registrations?.length || 0), 0)} participants`
                  : `${filteredRegistrations.length} participants`
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Participant Form */}
        {showEditForm && editingParticipant && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Edit Participant: {editingParticipant.playerName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-playerName">Player Name *</Label>
                  <Input
                    id="edit-playerName"
                    name="playerName"
                    value={editFormData.playerName}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-playerAge">Player Age</Label>
                  <Input
                    id="edit-playerAge"
                    name="playerAge"
                    type="number"
                    min="10"
                    max="18"
                    value={editFormData.playerAge}
                    onChange={handleEditFormChange}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-parentName">Parent/Guardian Name *</Label>
                  <Input
                    id="edit-parentName"
                    name="parentName"
                    value={editFormData.parentName}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-parentEmail">Email Address *</Label>
                  <Input
                    id="edit-parentEmail"
                    name="parentEmail"
                    type="email"
                    value={editFormData.parentEmail}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-parentPhone">Phone Number *</Label>
                  <Input
                    id="edit-parentPhone"
                    name="parentPhone"
                    type="tel"
                    value={editFormData.parentPhone}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-emergencyContact">Emergency Contact</Label>
                  <Input
                    id="edit-emergencyContact"
                    name="emergencyContact"
                    value={editFormData.emergencyContact}
                    onChange={handleEditFormChange}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="edit-emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    value={editFormData.emergencyPhone}
                    onChange={handleEditFormChange}
                    placeholder="Optional"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-experience">Volleyball Experience</Label>
                  <Textarea
                    id="edit-experience"
                    name="experience"
                    placeholder="Describe the player's volleyball experience"
                    value={editFormData.experience}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-medicalInfo">Medical Conditions/Allergies</Label>
                  <Textarea
                    id="edit-medicalInfo"
                    name="medicalInfo"
                    placeholder="Any medical conditions, allergies, or medications"
                    value={editFormData.medicalInfo}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-specialNotes">Special Notes</Label>
                  <Textarea
                    id="edit-specialNotes"
                    name="specialNotes"
                    placeholder="Any additional information or special requests"
                    value={editFormData.specialNotes}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button onClick={handleSaveParticipant}>
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingParticipant(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading participants...</p>
          </div>
        ) : !hasData ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No participants found matching your filters.</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("")
              setSportFilter("all")
              setDateFilter("all")
            }}>
              Clear Filters
            </Button>
          </div>
        ) : viewMode === 'by-session' ? (
          /* By Session View */
          <div className="space-y-6">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {session.sport?.charAt(0).toUpperCase() + session.sport?.slice(1)} - {session.ageGroup}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatSessionDate(session.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {session.location}
                        </div>
                      </div>
                      {session.focus && (
                        <p className="text-sm text-gray-600 mt-1">Focus: {session.focus}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(session)}>
                        {getStatusText(session)}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        {session.registrations?.length || 0}/{session.maxParticipants} players
                      </p>
                      {session.price > 0 && (
                        <p className="text-lg font-bold mt-1">${session.price}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {session.registrations && session.registrations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {session.registrations.map((registration, index) => (
                      <Card key={registration.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-lg">
                                  {index + 1}. {registration.playerName}
                                </h4>
                                {registration.playerAge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {registration.playerAge}y
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-transparent p-2"
                                  onClick={() => handleEditParticipant(registration)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 bg-transparent p-2"
                                  onClick={() => handleDeleteParticipant(registration.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-gray-700">{registration.parentName}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                <a href={`mailto:${registration.parentEmail}`} className="text-blue-600 hover:underline text-sm">
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

                            {registration.medicalInfo && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Medical Info</span>
                                </div>
                                <p className="text-sm text-red-700">{registration.medicalInfo}</p>
                              </div>
                            )}

                            {registration.experience && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Experience</span>
                                </div>
                                <p className="text-sm text-blue-700">{registration.experience}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No participants registered for this session yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* All Participants View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegistrations.map((registration) => (
              <Card key={registration.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{registration.playerName}</h3>
                        {registration.playerAge && (
                          <Badge variant="secondary" className="text-sm">
                            {registration.playerAge}y
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent p-2"
                          onClick={() => handleEditParticipant(registration)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent p-2"
                          onClick={() => handleDeleteParticipant(registration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">Parent: {registration.parentName}</span>
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

                    <div className="border-t pt-3">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Session Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="font-medium">{registration.session.sport?.charAt(0).toUpperCase() + registration.session.sport?.slice(1)} - {registration.session.ageGroup}</div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{formatSessionDate(registration.session.date)} at {registration.session.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{registration.session.location}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Registered: {formatRegistrationDate(registration.createdAt)}
                        </div>
                      </div>
                    </div>

                    {registration.medicalInfo && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Medical Info</span>
                        </div>
                        <p className="text-sm text-red-700">{registration.medicalInfo}</p>
                      </div>
                    )}

                    {registration.experience && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Experience</span>
                        </div>
                        <p className="text-sm text-blue-700">{registration.experience}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}