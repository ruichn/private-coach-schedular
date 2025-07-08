"use client"

import React from "react"

// Registration form tests
import { describe, it, expect, vi, beforeEach } from "@jest/globals"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

// Mock registration form component
const RegistrationForm = ({ onSubmit, session }: { onSubmit: (data: any) => void; session: any }) => {
  const [formData, setFormData] = React.useState({
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

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.playerName.trim()) newErrors.playerName = "Player name is required"
    if (!formData.playerAge.trim()) newErrors.playerAge = "Player age is required"
    if (!formData.parentName.trim()) newErrors.parentName = "Parent name is required"
    if (!formData.parentEmail.trim()) newErrors.parentEmail = "Parent email is required"
    if (!formData.parentPhone.trim()) newErrors.parentPhone = "Parent phone is required"
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required"
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency phone is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.parentEmail && !emailRegex.test(formData.parentEmail)) {
      newErrors.parentEmail = "Invalid email format"
    }

    // Phone validation
    const phoneRegex = /^$$\d{3}$$\s\d{3}-\d{4}$/
    if (formData.parentPhone && !phoneRegex.test(formData.parentPhone)) {
      newErrors.parentPhone = "Phone must be in format (555) 123-4567"
    }
    if (formData.emergencyPhone && !phoneRegex.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = "Phone must be in format (555) 123-4567"
    }

    // Age validation
    const age = Number.parseInt(formData.playerAge)
    if (formData.playerAge && (isNaN(age) || age < 10 || age > 18)) {
      newErrors.playerAge = "Age must be between 10 and 18"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form data-testid="registration-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="playerName">Player Name *</label>
        <input
          id="playerName"
          data-testid="player-name"
          value={formData.playerName}
          onChange={(e) => handleInputChange("playerName", e.target.value)}
        />
        {errors.playerName && <span data-testid="player-name-error">{errors.playerName}</span>}
      </div>

      <div>
        <label htmlFor="playerAge">Player Age *</label>
        <input
          id="playerAge"
          data-testid="player-age"
          type="number"
          value={formData.playerAge}
          onChange={(e) => handleInputChange("playerAge", e.target.value)}
        />
        {errors.playerAge && <span data-testid="player-age-error">{errors.playerAge}</span>}
      </div>

      <div>
        <label htmlFor="parentName">Parent Name *</label>
        <input
          id="parentName"
          data-testid="parent-name"
          value={formData.parentName}
          onChange={(e) => handleInputChange("parentName", e.target.value)}
        />
        {errors.parentName && <span data-testid="parent-name-error">{errors.parentName}</span>}
      </div>

      <div>
        <label htmlFor="parentEmail">Parent Email *</label>
        <input
          id="parentEmail"
          data-testid="parent-email"
          type="email"
          value={formData.parentEmail}
          onChange={(e) => handleInputChange("parentEmail", e.target.value)}
        />
        {errors.parentEmail && <span data-testid="parent-email-error">{errors.parentEmail}</span>}
      </div>

      <div>
        <label htmlFor="parentPhone">Parent Phone *</label>
        <input
          id="parentPhone"
          data-testid="parent-phone"
          value={formData.parentPhone}
          onChange={(e) => handleInputChange("parentPhone", e.target.value)}
        />
        {errors.parentPhone && <span data-testid="parent-phone-error">{errors.parentPhone}</span>}
      </div>

      <div>
        <label htmlFor="emergencyContact">Emergency Contact *</label>
        <input
          id="emergencyContact"
          data-testid="emergency-contact"
          value={formData.emergencyContact}
          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
        />
        {errors.emergencyContact && <span data-testid="emergency-contact-error">{errors.emergencyContact}</span>}
      </div>

      <div>
        <label htmlFor="emergencyPhone">Emergency Phone *</label>
        <input
          id="emergencyPhone"
          data-testid="emergency-phone"
          value={formData.emergencyPhone}
          onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
        />
        {errors.emergencyPhone && <span data-testid="emergency-phone-error">{errors.emergencyPhone}</span>}
      </div>

      <div>
        <label htmlFor="medicalInfo">Medical Information</label>
        <textarea
          id="medicalInfo"
          data-testid="medical-info"
          value={formData.medicalInfo}
          onChange={(e) => handleInputChange("medicalInfo", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="experience">Experience</label>
        <textarea
          id="experience"
          data-testid="experience"
          value={formData.experience}
          onChange={(e) => handleInputChange("experience", e.target.value)}
        />
      </div>

      <button type="submit" data-testid="submit-button">
        Register for Session
      </button>
    </form>
  )
}

describe("RegistrationForm Component", () => {
  const mockSession = {
    id: 1,
    ageGroup: "U13",
    subgroup: "Beginners",
    price: 25,
  }

  let mockOnSubmit: any

  beforeEach(() => {
    mockOnSubmit = vi.fn()
  })

  it("should render all form fields", () => {
    render(<RegistrationForm onSubmit={mockOnSubmit} session={mockSession} />)

    expect(screen.getByTestId("player-name")).toBeInTheDocument()
    expect(screen.getByTestId("player-age")).toBeInTheDocument()
    expect(screen.getByTestId("parent-name")).toBeInTheDocument()
    expect(screen.getByTestId("parent-email")).toBeInTheDocument()
    expect(screen.getByTestId("parent-phone")).toBeInTheDocument()
    expect(screen.getByTestId("emergency-contact")).toBeInTheDocument()
    expect(screen.getByTestId("emergency-phone")).toBeInTheDocument()
    expect(screen.getByTestId("medical-info")).toBeInTheDocument()
    expect(screen.getByTestId("experience")).toBeInTheDocument()
    expect(screen.getByTestId("submit-button")).toBeInTheDocument()
  })

  it("should show validation errors for required fields", async () => {
    const user = userEvent.setup()
    render(<RegistrationForm onSubmit={mockOnSubmit} session={mockSession} />)

    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId("player-name-error")).toHaveTextContent("Player name is required")
      expect(screen.getByTestId("player-age-error")).toHaveTextContent("Player age is required")
      expect(screen.getByTestId("parent-name-error")).toHaveTextContent("Parent name is required")
      expect(screen.getByTestId("parent-email-error")).toHaveTextContent("Parent email is required")
      expect(screen.getByTestId("parent-phone-error")).toHaveTextContent("Parent phone is required")
      expect(screen.getByTestId("emergency-contact-error")).toHaveTextContent("Emergency contact is required")
      expect(screen.getByTestId("emergency-phone-error")).toHaveTextContent("Emergency phone is required")
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it("should validate email format", async () => {
    const user = userEvent.setup()
    render(<RegistrationForm onSubmit={mockOnSubmit} session={mockSession} />)

    const emailInput = screen.getByTestId("parent-email")
    await user.type(emailInput, "invalid-email")

    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId("parent-email-error")).toHaveTextContent("Invalid email format")
    })
  })

  it("should validate phone format", async () => {
    const user = userEvent.setup()
    render(<RegistrationForm onSubmit={mockOnSubmit} session={mockSession} />)

    const phoneInput = screen.getByTestId("parent-phone")
    await user.type(phoneInput, "555-123-4567")

    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId("parent-phone-error")).toHaveTextContent("Phone must be in format (555) 123-4567")
    })
  })

  it("should validate age range", async () => {
    const user = userEvent.setup()
    render(<RegistrationForm onSubmit={mockOnSubmit} session={mockSession} />)

    const ageInput = screen.getByTestId("player-age")
    await user.type(ageInput, "25")

    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId("player-age-error")).toHaveTextContent("Age must be between 10 and 18")
    })
  })

  it("should submit form with valid data", async () => {
    const user = userEvent.setup()
    render(<RegistrationForm onSubmit={mockOnSubmit} session={mockSession} />)

    // Fill out all required fields with valid data
    await user.type(screen.getByTestId("player-name"), "Emma Johnson")
    await user.type(screen.getByTestId("player-age"), "12")
    await user.type(screen.getByTestId("parent-name"), "Sarah Johnson")
    await user.type(screen.getByTestId("parent-email"), "sarah.johnson@email.com")
    await user.type(screen.getByTestId("parent-phone"), "(555) 123-4567")
    await user.type(screen.getByTestId("emergency-contact"), "Mike Johnson")
    await user.type(screen.getByTestId("emergency-phone"), "(555) 987-6543")

    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        playerName: "Emma Johnson",
        playerAge: "12",
        parentName: "Sarah Johnson",
        parentEmail: "sarah.johnson@email.com",
        parentPhone: "(555) 123-4567",
        emergencyContact: "Mike Johnson",
        emergencyPhone: "(555) 987-6543",
        medicalInfo: "",
        experience: "",
        specialNotes: "",
      })
    })
  })

  it("should clear errors when user starts typing", async () => {
    const user = userEvent.setup()
    render(<RegistrationForm onSubmit={mockOnSubmit} session={mockSession} />)

    // Trigger validation errors
    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId("player-name-error")).toBeInTheDocument()
    })

    // Start typing in the field
    const playerNameInput = screen.getByTestId("player-name")
    await user.type(playerNameInput, "E")

    await waitFor(() => {
      expect(screen.queryByTestId("player-name-error")).not.toBeInTheDocument()
    })
  })
})
