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
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react"
import { formatSessionDate, formatDateForInput } from "@/lib/date-utils"

interface Session {
  id: number
  sport: string
  ageGroup: string
  date: string
  time: string
  location: string
  address: string
  maxParticipants: number
  currentParticipants: number
  price: number
  focus: string
  status: string
}

interface Location {
  id: number
  name: string
  address: string
  createdAt: string
  lastUsed: string
}

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAdminAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [showNewLocationForm, setShowNewLocationForm] = useState(false)
  const [newLocationData, setNewLocationData] = useState({ name: '', address: '' })
  const [showLocationManager, setShowLocationManager] = useState(false)
  const [formData, setFormData] = useState({
    sport: "",
    ageGroup: "",
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

  // Check authentication on component mount
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
  }, [router])

  // Fetch sessions and locations from API
  useEffect(() => {
    if (isAdminAuthenticated()) {
      fetchSessions()
      fetchLocations()
    }
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        const formattedSessions = data.map((session: any) => ({
          id: session.id,
          sport: session.sport || 'volleyball', // Default to volleyball for existing sessions
          ageGroup: session.ageGroup,
          date: session.date.split('T')[0], // Keep as YYYY-MM-DD for form input
          time: session.time,
          location: session.location,
          address: session.address,
          maxParticipants: session.maxParticipants,
          currentParticipants: session.registrations.length,
          price: session.price,
          focus: session.focus,
          status: session.registrations.length >= session.maxParticipants ? 'full' : 'open',
        }))
        setSessions(formattedSessions)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      alert('Error loading sessions')
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      if (response.ok) {
        const data = await response.json()
        setLocations(data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

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
    
    // Auto-fill address when location is selected
    if (name === 'location' && value !== 'new-location') {
      const selectedLocation = locations.find(loc => loc.name === value)
      if (selectedLocation) {
        setFormData((prev) => ({
          ...prev,
          address: selectedLocation.address
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.sport || !formData.ageGroup || !formData.date || 
        !formData.startTime || !formData.endTime || !formData.location || 
        !formData.address || !formData.maxParticipants) {
      alert('Please fill in all required fields')
      return
    }

    // Save location if it's new and doesn't exist
    await saveLocationIfNew(formData.location, formData.address)

    const sessionData = {
      coachId: 2, // Default to Coach Robe (existing coach ID)
      sport: formData.sport,
      ageGroup: formData.ageGroup,
      date: formData.date,
      time: `${convertTo12Hour(formData.startTime)} - ${convertTo12Hour(formData.endTime)}`,
      location: formData.location,
      address: formData.address,
      maxParticipants: Number.parseInt(formData.maxParticipants),
      price: formData.price ? Number.parseFloat(formData.price) : 0,
      focus: formData.focus || '',
    }
    

    try {
      let response
      if (editingSession) {
        // Update existing session
        response = await fetch(`/api/sessions/${editingSession.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        })
      } else {
        // Create new session
        response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        })
      }

      if (response.ok) {
        await fetchSessions() // Refresh the sessions list
        await fetchLocations() // Refresh locations list
        setShowCreateForm(false)
        setEditingSession(null)
        setShowNewLocationForm(false)
        resetForm()
        alert(editingSession ? "Session updated successfully!" : "Session created successfully!")
      } else {
        const errorData = await response.json()
        console.error('Session save error:', errorData)
        alert(`Error saving session: ${errorData.error || errorData.details || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving session:', error)
      alert('Error saving session')
    }
  }

  const saveLocationIfNew = async (locationName: string, address: string) => {
    // Check if location already exists
    const existingLocation = locations.find(loc => 
      loc.name.toLowerCase() === locationName.toLowerCase()
    )
    
    if (!existingLocation && locationName && address) {
      try {
        const response = await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: locationName, address }),
        })
        
        if (response.ok) {
          console.log('New location saved:', locationName)
          await fetchLocations() // Refresh locations list immediately
        }
      } catch (error) {
        console.error('Error saving location:', error)
      }
    }
  }

  const deleteLocation = async (locationId: number, locationName: string) => {
    if (confirm(`Are you sure you want to delete the location "${locationName}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/locations?id=${locationId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchLocations() // Refresh locations list
          alert('Location deleted successfully!')
        } else {
          const errorData = await response.json()
          alert(`Error deleting location: ${errorData.error || errorData.details || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting location:', error)
        alert('Error deleting location')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      sport: "",
      ageGroup: "",
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
    setNewLocationData({ name: '', address: '' })
    setShowNewLocationForm(false)
  }

  const deleteSession = async (id: number) => {
    if (confirm("Are you sure you want to delete this session? This will also delete all registrations for this session.")) {
      try {
        console.log('Deleting session:', id)
        const response = await fetch(`/api/sessions/${id}`, {
          method: 'DELETE',
        })
        
        console.log('Delete response status:', response.status)
        
        if (response.ok) {
          await fetchSessions() // Refresh the sessions list
          alert('Session deleted successfully!')
        } else {
          const errorData = await response.json()
          console.error('Delete error response:', errorData)
          alert(`Error deleting session: ${errorData.details || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting session:', error)
        alert('Error deleting session - check console for details')
      }
    }
  }

  const editSession = (session: Session) => {
    setEditingSession(session)
    setShowCreateForm(true)
    
    // Parse the time string to get start and end times
    const [startTime, endTime] = session.time.split(' - ')
    
    setFormData({
      sport: session.sport || "volleyball", // Default to volleyball for existing sessions
      ageGroup: session.ageGroup,
      date: session.date,
      startTime: convertTo24Hour(startTime),
      endTime: convertTo24Hour(endTime),
      location: session.location,
      address: session.address,
      maxParticipants: session.maxParticipants.toString(),
      price: session.price.toString(),
      focus: session.focus,
      notes: "",
    })
  }

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    
    if (modifier === 'AM') {
      if (hours === '12') {
        hours = '00'
      }
    } else if (modifier === 'PM') {
      if (hours !== '12') {
        hours = (parseInt(hours, 10) + 12).toString()
      }
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`
  }

  const convertTo12Hour = (time24h: string) => {
    const [hours, minutes] = time24h.split(':')
    const hour12 = parseInt(hours, 10)
    const ampm = hour12 >= 12 ? 'PM' : 'AM'
    const displayHour = hour12 % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
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
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
            <Button variant="outline" onClick={() => setShowLocationManager(!showLocationManager)}>
              <MapPin className="h-4 w-4 mr-2" />
              Manage Locations
            </Button>
            <Button variant="ghost" onClick={logout} className="text-red-600 hover:text-red-700">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Session Management</h1>
          {loading ? (
            <p className="text-gray-500">Loading sessions...</p>
          ) : (
            <p className="text-gray-500">Managing {sessions.length} sessions</p>
          )}
        </div>

        {/* Create Session Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingSession ? 'Edit Training Session' : 'Create New Training Session'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sport">Sport *</Label>
                    <Select value={formData.sport} onValueChange={(value) => handleSelectChange("sport", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volleyball">Volleyball</SelectItem>
                        <SelectItem value="basketball">Basketball</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ageGroup">Age Group *</Label>
                    <Select value={formData.ageGroup} onValueChange={(value) => handleSelectChange("ageGroup", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="U12">U12</SelectItem>
                        <SelectItem value="U13">U13</SelectItem>
                        <SelectItem value="U14">U14</SelectItem>
                        <SelectItem value="U15">U15</SelectItem>
                        <SelectItem value="U16">U16</SelectItem>
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
                    <Select value={formData.startTime} onValueChange={(value) => handleSelectChange("startTime", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="06:30">6:30 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="07:30">7:30 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="08:30">8:30 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="09:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="10:30">10:30 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="11:30">11:30 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="12:30">12:30 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="13:30">1:30 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="14:30">2:30 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="15:30">3:30 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="18:30">6:30 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="19:30">7:30 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="20:30">8:30 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="21:30">9:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Select value={formData.endTime} onValueChange={(value) => handleSelectChange("endTime", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="06:30">6:30 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="07:30">7:30 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="08:30">8:30 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="09:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="10:30">10:30 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="11:30">11:30 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="12:30">12:30 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="13:30">1:30 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="14:30">2:30 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="15:30">3:30 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="18:30">6:30 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="19:30">7:30 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="20:30">8:30 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="21:30">9:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    {showNewLocationForm || (formData.location && !locations.some(loc => loc.name === formData.location)) ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          value={formData.location || ''} 
                          onChange={handleInputChange}
                          name="location"
                          placeholder="Enter location name"
                          className="flex-1"
                        />
                        {!showNewLocationForm && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, location: '', address: '' }))
                            }}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Select 
                        value={formData.location || ''} 
                        onValueChange={(value) => {
                          if (value === 'new-location') {
                            setShowNewLocationForm(true)
                            setFormData(prev => ({ ...prev, location: '', address: '' }))
                            setNewLocationData({ name: '', address: '' })
                          } else {
                            handleSelectChange('location', value)
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue 
                            placeholder="Select location or add new"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.name}>
                              {location.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="new-location">
                            + Add New Location
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                      required
                    />
                  </div>
                </div>

                {/* New Location Form */}
                {showNewLocationForm && (
                  <div className="bg-blue-50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-3 text-blue-800">Add New Location</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newLocationName">Location Name *</Label>
                        <Input
                          id="newLocationName"
                          value={newLocationData.name}
                          onChange={(e) => {
                            setNewLocationData(prev => ({ ...prev, name: e.target.value }))
                            setFormData(prev => ({ ...prev, location: e.target.value }))
                          }}
                          placeholder="Enter location name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="newLocationAddress">Address *</Label>
                        <Input
                          id="newLocationAddress"
                          value={newLocationData.address}
                          onChange={(e) => {
                            setNewLocationData(prev => ({ ...prev, address: e.target.value }))
                            setFormData(prev => ({ ...prev, address: e.target.value }))
                          }}
                          placeholder="Enter full address"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setShowNewLocationForm(false)
                          setFormData(prev => ({ ...prev, location: '', address: '' }))
                          setNewLocationData({ name: '', address: '' })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={() => {
                          if (newLocationData.name && newLocationData.address) {
                            // Set form data and close form immediately
                            setFormData(prev => ({ 
                              ...prev, 
                              location: newLocationData.name,
                              address: newLocationData.address
                            }))
                            setShowNewLocationForm(false)
                            // Show confirmation with more debug info
                            console.log('Location set:', {
                              locationName: newLocationData.name,
                              address: newLocationData.address,
                              existingLocations: locations.map(l => l.name),
                              willShowAsCurrent: !locations.some(loc => loc.name === newLocationData.name)
                            })
                          }
                        }}
                        disabled={!newLocationData.name || !newLocationData.address}
                      >
                        Use This Location
                      </Button>
                    </div>
                  </div>
                )}

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
                    <Label htmlFor="price">Price per Player ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="focus">Session Focus</Label>
                  <Input
                    id="focus"
                    name="focus"
                    placeholder="e.g., Basic Skills & Fundamentals"
                    value={formData.focus}
                    onChange={handleInputChange}
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
                  <Button type="submit">{editingSession ? 'Update Session' : 'Create Session'}</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowCreateForm(false)
                    setEditingSession(null)
                    resetForm()
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Location Management */}
        {showLocationManager && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Manage Locations</CardTitle>
              <p className="text-sm text-gray-600">Add, edit, or delete training locations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No locations found. Create a session to add your first location.</p>
                ) : (
                  locations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-500">{location.address}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Last used: {new Date(location.lastUsed).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteLocation(location.id, location.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Sessions */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading sessions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
            <Card key={session.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {session.sport?.charAt(0).toUpperCase() + session.sport?.slice(1)} - {session.ageGroup}
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
                  <span>{formatSessionDate(session.date)}</span>
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
                  {session.price > 0 && (
                    <div className="font-bold text-lg">${session.price}</div>
                  )}
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 bg-transparent"
                    onClick={() => editSession(session)}
                  >
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
        )}
      </main>
    </div>
  )
}
