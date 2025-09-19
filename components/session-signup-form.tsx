"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, UserX, AlertTriangle, ArrowLeft, Calendar, Download } from "lucide-react"

interface SessionData {
  id: number
  sport: string
  ageGroup: string
  date: Date
  time: string
  location: string
  address: string
  focus: string
}

interface SessionSignupFormProps {
  sessionId: number
  sessionPrice: number
  sessionData?: SessionData
  onRegistrationSuccess?: () => void
}

export default function SessionSignupForm({ sessionId, sessionPrice, sessionData, onRegistrationSuccess }: SessionSignupFormProps) {
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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [registeredPlayerName, setRegisteredPlayerName] = useState("")
  const [duplicateError, setDuplicateError] = useState<string>("")

  // Calendar generation functions
  const generateCalendarEvent = (format: 'google' | 'outlook' | 'ics') => {
    if (!sessionData) return


    // Handle date creation more safely, avoiding timezone issues
    let startDate: Date
    
    if (sessionData.date instanceof Date) {
      // If it's already a Date object, check if it needs timezone correction
      const existingDate = sessionData.date
      
      // Check if the date appears to be off by timezone (common issue)
      // If the time shows as 17:00:00 (5 PM) but should be start of day, fix it
      if (existingDate.getHours() !== 0 || existingDate.getMinutes() !== 0) {
        // Create a new date using just the date components in local timezone
        startDate = new Date(existingDate.getFullYear(), existingDate.getMonth(), existingDate.getDate())
      } else {
        startDate = new Date(existingDate)
      }
    } else {
      // If it's a string, parse it properly and avoid timezone issues
      const dateStr = sessionData.date.toString()
      
      // If it's an ISO string, parse it as local date to avoid timezone conversion
      if (dateStr.includes('T') || dateStr.includes('Z')) {
        // Extract just the date part (YYYY-MM-DD) and create local date
        const datePart = dateStr.split('T')[0]
        const [year, month, day] = datePart.split('-').map(Number)
        startDate = new Date(year, month - 1, day, 0, 0, 0, 0) // month is 0-indexed, set time to start of day
      } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Simple YYYY-MM-DD format
        const [year, month, day] = dateStr.split('-').map(Number)
        startDate = new Date(year, month - 1, day, 0, 0, 0, 0)
      } else {
        startDate = new Date(dateStr)
      }
    }
    
    // Validate the date
    if (isNaN(startDate.getTime())) {
      console.error('Invalid date:', sessionData.date)
      alert('Unable to create calendar event due to invalid date.')
      return
    }

    // Parse time range format like "5:30 PM - 7:00 PM"
    const parseTimeRange = (timeString: string) => {
      const parts = timeString.split(' - ')
      if (parts.length !== 2) {
        throw new Error('Invalid time range format')
      }
      
      const parseTime = (timeStr: string) => {
        const trimmed = timeStr.trim()
        const isPM = trimmed.toLowerCase().includes('pm')
        const isAM = trimmed.toLowerCase().includes('am')
        
        // Remove AM/PM
        const cleanTime = trimmed.replace(/\s*(am|pm)/i, '')
        const [hourStr, minuteStr] = cleanTime.split(':')
        let hours = parseInt(hourStr, 10)
        const minutes = parseInt(minuteStr, 10) || 0
        
        // Convert to 24-hour format
        if (isPM && hours !== 12) {
          hours += 12
        } else if (isAM && hours === 12) {
          hours = 0
        }
        
        return { hours, minutes }
      }
      
      const startTime = parseTime(parts[0])
      const endTime = parseTime(parts[1])
      
      return { startTime, endTime }
    }
    
    let startTime: { hours: number, minutes: number }
    let endTime: { hours: number, minutes: number }
    
    try {
      const parsedTimes = parseTimeRange(sessionData.time)
      startTime = parsedTimes.startTime
      endTime = parsedTimes.endTime
      
      // Validate hour and minute ranges
      if (startTime.hours < 0 || startTime.hours > 23 || startTime.minutes < 0 || startTime.minutes > 59 ||
          endTime.hours < 0 || endTime.hours > 23 || endTime.minutes < 0 || endTime.minutes > 59) {
        console.error('Time values out of range:', { startTime, endTime })
        alert('Unable to create calendar event due to invalid time values.')
        return
      }
    } catch (error) {
      console.error('Error parsing time:', error, 'Time string:', sessionData.time)
      alert('Unable to create calendar event due to invalid time format.')
      return
    }
    
    startDate.setHours(startTime.hours, startTime.minutes, 0, 0)
    
    const endDate = new Date(startDate)
    endDate.setHours(endTime.hours, endTime.minutes, 0, 0) // Use actual end time
    
    // Validate both dates before proceeding
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid dates after time processing:', { startDate, endDate })
      alert('Unable to create calendar event due to invalid time values.')
      return
    }
    
    const title = `${sessionData.sport.charAt(0).toUpperCase() + sessionData.sport.slice(1)} Training - ${sessionData.ageGroup}`
    const description = `${sessionData.focus}\n\nRegistered player: ${registeredPlayerName}\nCoach: Coach Robe Sports Training`
    const location = `${sessionData.location}, ${sessionData.address}`
    
    if (format === 'google') {
      const googleStartDate = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      const googleEndDate = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${googleStartDate}/${googleEndDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
      window.open(googleUrl, '_blank')
    } else if (format === 'outlook') {
      const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
      window.open(outlookUrl, '_blank')
    } else if (format === 'ics') {
      const formatDate = (date: Date) => {
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date provided to formatDate')
        }
        
        // Format as local time instead of UTC to avoid timezone issues
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        
        // Return in local time format (without Z suffix which indicates UTC)
        return `${year}${month}${day}T${hours}${minutes}${seconds}`
      }
      
      try {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Coach Robe Sports Training//EN
BEGIN:VEVENT
UID:${sessionData.id}-${Date.now()}@coachrobe.com
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`
        
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
        link.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error creating ICS file:', error)
        alert('Unable to create calendar file. Please try Google Calendar or Outlook instead.')
      }
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Apply formatting
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    }
  }

  const validatePhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '')
    return numbers.length === 10
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Format phone numbers as user types
    if (name === 'parentPhone' || name === 'emergencyPhone') {
      const formatted = formatPhoneNumber(value)
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setDuplicateError("") // Clear any previous errors

    // Validate phone numbers
    if (!validatePhoneNumber(formData.parentPhone)) {
      alert('Please enter a valid 10-digit phone number for parent/guardian')
      setIsSubmitting(false)
      return
    }

    if (formData.emergencyPhone && !validatePhoneNumber(formData.emergencyPhone)) {
      alert('Please enter a valid 10-digit emergency phone number or leave it empty')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setRegisteredPlayerName(formData.playerName)
        setIsSuccess(true)
        // Notify parent component of successful registration
        onRegistrationSuccess?.()
        // Reset form
        setFormData({
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
      } else {
        const error = await response.json()
        
        // Handle duplicate registration with special UI
        if (error.isDuplicate) {
          setDuplicateError(error.error)
        } else {
          alert(`Registration failed: ${error.error}`)
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Registration Successful!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for registering <strong>{registeredPlayerName}</strong> for this training session. 
          A confirmation email with session details and cancellation link has been sent to your email address.
        </p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>What's next?</strong>
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your email for confirmation and session details</li>
              <li>• Payment is collected on-site at the training session</li>
              <li>• Arrive 10 minutes early for check-in</li>
              <li>• Use the cancellation link in the email if needed (expires 24 hours before session)</li>
              <li>• Or cancel manually anytime using the button below</li>
            </ul>
          </div>

          {sessionData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-3">
                <Calendar className="h-4 w-4 inline mr-1" />
                <strong>Add to Calendar</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateCalendarEvent('google')}
                  className="bg-white hover:bg-gray-50"
                >
                  Google Calendar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateCalendarEvent('outlook')}
                  className="bg-white hover:bg-gray-50"
                >
                  Outlook
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateCalendarEvent('ics')}
                  className="bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download .ics
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sessions">
              <Button variant="outline">View More Sessions</Button>
            </Link>
            <Link href="/cancel">
              <Button variant="outline">
                <UserX className="h-4 w-4 mr-2" />
                Cancel Registration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (duplicateError) {
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">Already Registered!</h3>
        <p className="text-gray-700 mb-6 max-w-md mx-auto">
          {duplicateError}
        </p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Need to make changes?</strong>
            </p>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Check your email for the confirmation with cancellation link</li>
              <li>• Contact Coach Robe directly for assistance</li>
              <li>• Use the cancellation form if you need to re-register</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setDuplicateError("")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Different Details
            </Button>
            <Link href="/cancel">
              <Button variant="outline">
                <UserX className="h-4 w-4 mr-2" />
                Cancel Registration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
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
            <Label htmlFor="playerAge">Player Age (Optional)</Label>
            <Input
              id="playerAge"
              name="playerAge"
              type="number"
              min="10"
              max="18"
              value={formData.playerAge}
              onChange={handleInputChange}
              placeholder="Optional"
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
              placeholder="(123) 456-7890"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Format: (123) 456-7890</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Emergency Contact (Optional)</h3>
        <p className="text-sm text-gray-600">Provide emergency contact information if different from parent/guardian above.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
            <Input
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="emergencyPhone">Emergency Phone</Label>
            <Input
              id="emergencyPhone"
              name="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
            />
            <p className="text-xs text-gray-500 mt-1">Format: (123) 456-7890</p>
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
        {sessionPrice > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Session Fee:</span>
              <span className="text-2xl font-bold">${sessionPrice}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Payment will be collected at the session. Please bring exact change or be prepared to pay via
              Venmo/Zelle.
            </p>
          </>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register for Session"}
        </Button>
      </div>
    </form>
  )
}