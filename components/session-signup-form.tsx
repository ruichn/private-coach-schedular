"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, UserX } from "lucide-react"

interface SessionSignupFormProps {
  sessionId: number
  sessionPrice: number
}

export default function SessionSignupForm({ sessionId, sessionPrice }: SessionSignupFormProps) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

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
        alert(`Registration failed: ${error.error}`)
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
              required
            />
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
              placeholder="Optional"
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
          <span className="text-2xl font-bold">${sessionPrice}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Payment will be collected at the session. Please bring exact change or be prepared to pay via
          Venmo/Zelle.
        </p>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register for Session"}
        </Button>
      </div>
    </form>
  )
}