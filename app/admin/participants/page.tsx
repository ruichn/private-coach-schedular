"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAdminAuthenticated, useAdminAuth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Mail, Phone, Download, Search, Filter, FileText, ArrowLeft, Grid, List, User } from "lucide-react"
import { formatSessionDate } from "@/lib/date-utils"

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
      }

      // Fetch all registrations for all-participants view
      const registrationsResponse = await fetch('/api/registrations', {
        credentials: 'include'
      })
      if (registrationsResponse.ok) {
        const registrationsData = await registrationsResponse.json()
        setAllRegistrations(registrationsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
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
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Coach Robe Admin
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium hover:text-gray-600">
              Sessions
            </Link>
            <span className="text-sm font-medium text-blue-600">
              Participants
            </span>
            <Link href="/admin/locations" className="text-sm font-medium hover:text-gray-600">
              Locations
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
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
              <div className="flex bg-gray-100 rounded-lg p-1">
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
                      <Card key={registration.id} className="p-4 border-l-4 border-l-blue-500">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                              {index + 1}. {registration.playerName}
                            </h4>
                            {registration.playerAge && (
                              <span className="text-sm text-gray-500">({registration.playerAge}y)</span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-2 text-gray-400" />
                              <span>{registration.parentName}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-2 text-gray-400" />
                              <a href={`mailto:${registration.parentEmail}`} className="text-blue-600 hover:underline text-xs">
                                {registration.parentEmail}
                              </a>
                            </div>
                            
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-2 text-gray-400" />
                              <a href={`tel:${registration.parentPhone}`} className="text-blue-600 hover:underline">
                                {registration.parentPhone}
                              </a>
                            </div>
                          </div>

                          {registration.medicalInfo && (
                            <div className="bg-red-50 border border-red-200 rounded p-2">
                              <span className="text-xs font-medium text-red-600 uppercase">Medical</span>
                              <p className="text-xs text-red-700">{registration.medicalInfo}</p>
                            </div>
                          )}

                          {registration.experience && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                              <span className="text-xs font-medium text-blue-600 uppercase">Experience</span>
                              <p className="text-xs text-blue-700">{registration.experience}</p>
                            </div>
                          )}
                        </div>
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
              <Card key={registration.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{registration.playerName}</h3>
                    {registration.playerAge && (
                      <span className="text-sm text-gray-500">({registration.playerAge}y)</span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Parent: {registration.parentName}</span>
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
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>{registration.session.sport?.charAt(0).toUpperCase() + registration.session.sport?.slice(1)} - {registration.session.ageGroup}</div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatSessionDate(registration.session.date)} at {registration.session.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {registration.session.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        Registered: {formatRegistrationDate(registration.createdAt)}
                      </div>
                    </div>
                  </div>

                  {registration.medicalInfo && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <span className="text-xs font-medium text-red-600 uppercase">Medical Info</span>
                      <p className="text-sm text-red-700 mt-1">{registration.medicalInfo}</p>
                    </div>
                  )}

                  {registration.experience && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <span className="text-xs font-medium text-blue-600 uppercase">Experience</span>
                      <p className="text-sm text-blue-700 mt-1">{registration.experience}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}