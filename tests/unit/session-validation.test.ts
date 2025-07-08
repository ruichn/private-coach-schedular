// Unit tests for session validation logic
import { describe, it, expect, beforeEach } from "@jest/globals"
import type { TestSession, TestFormData } from "../types/test-types"

describe("Session Validation Logic", () => {
  let validSession: TestSession
  let validFormData: TestFormData

  beforeEach(() => {
    validSession = {
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
    }

    validFormData = {
      playerName: "Emma Johnson",
      playerAge: "12",
      parentName: "Sarah Johnson",
      parentEmail: "sarah.johnson@email.com",
      parentPhone: "(555) 123-4567",
      emergencyContact: "Mike Johnson",
      emergencyPhone: "(555) 987-6543",
      medicalInfo: "",
      experience: "Beginner",
      specialNotes: "",
    }
  })

  describe("Session Creation Validation", () => {
    it("should validate required session fields", () => {
      const validateSession = (session: Partial<TestSession>) => {
        const required = [
          "ageGroup",
          "subgroup",
          "date",
          "time",
          "location",
          "address",
          "maxParticipants",
          "price",
          "focus",
        ]
        return required.every(
          (field) => session[field as keyof TestSession] !== undefined && session[field as keyof TestSession] !== "",
        )
      }

      expect(validateSession(validSession)).toBe(true)
      expect(validateSession({ ...validSession, ageGroup: "" })).toBe(false)
      expect(validateSession({ ...validSession, location: undefined })).toBe(false)
    })

    it("should validate age group options", () => {
      const validateAgeGroup = (ageGroup: string) => {
        return ["U13", "U14", "U15", "U16"].includes(ageGroup)
      }

      expect(validateAgeGroup("U13")).toBe(true)
      expect(validateAgeGroup("U17")).toBe(false)
      expect(validateAgeGroup("")).toBe(false)
    })

    it("should validate subgroup based on age group", () => {
      const validateSubgroup = (ageGroup: string, subgroup: string) => {
        const subgroups = {
          U13: ["Beginners", "Intermediate"],
          U14: ["Beginners", "Intermediate", "Advanced"],
          U15: ["Developmental", "Competitive"],
          U16: ["Developmental", "Competitive", "Elite"],
        }
        return subgroups[ageGroup as keyof typeof subgroups]?.includes(subgroup) || false
      }

      expect(validateSubgroup("U13", "Beginners")).toBe(true)
      expect(validateSubgroup("U13", "Elite")).toBe(false)
      expect(validateSubgroup("U16", "Elite")).toBe(true)
    })

    it("should validate participant limits", () => {
      const validateParticipantLimits = (maxParticipants: number, currentParticipants: number) => {
        return (
          maxParticipants > 0 &&
          maxParticipants <= 20 &&
          currentParticipants >= 0 &&
          currentParticipants <= maxParticipants
        )
      }

      expect(validateParticipantLimits(12, 8)).toBe(true)
      expect(validateParticipantLimits(0, 0)).toBe(false)
      expect(validateParticipantLimits(25, 10)).toBe(false)
      expect(validateParticipantLimits(10, 15)).toBe(false)
    })

    it("should validate session date is in the future", () => {
      const validateFutureDate = (dateString: string) => {
        const sessionDate = new Date(dateString)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return sessionDate >= today
      }

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)

      expect(validateFutureDate(futureDate.toISOString().split("T")[0])).toBe(true)
      expect(validateFutureDate(pastDate.toISOString().split("T")[0])).toBe(false)
    })

    it("should validate price is positive", () => {
      const validatePrice = (price: number) => {
        return price > 0 && price <= 200
      }

      expect(validatePrice(25)).toBe(true)
      expect(validatePrice(0)).toBe(false)
      expect(validatePrice(-10)).toBe(false)
      expect(validatePrice(250)).toBe(false)
    })
  })

  describe("Registration Form Validation", () => {
    it("should validate required form fields", () => {
      const validateFormData = (data: TestFormData) => {
        const required = [
          "playerName",
          "playerAge",
          "parentName",
          "parentEmail",
          "parentPhone",
          "emergencyContact",
          "emergencyPhone",
        ]
        return required.every(
          (field) => data[field as keyof TestFormData] && data[field as keyof TestFormData].trim() !== "",
        )
      }

      expect(validateFormData(validFormData)).toBe(true)
      expect(validateFormData({ ...validFormData, playerName: "" })).toBe(false)
      expect(validateFormData({ ...validFormData, parentEmail: "   " })).toBe(false)
    })

    it("should validate email format", () => {
      const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      }

      expect(validateEmail("sarah.johnson@email.com")).toBe(true)
      expect(validateEmail("invalid-email")).toBe(false)
      expect(validateEmail("test@")).toBe(false)
      expect(validateEmail("@domain.com")).toBe(false)
    })

    it("should validate phone number format", () => {
      const validatePhone = (phone: string) => {
        const phoneRegex = /^$$\d{3}$$\s\d{3}-\d{4}$/
        return phoneRegex.test(phone)
      }

      expect(validatePhone("(555) 123-4567")).toBe(true)
      expect(validatePhone("555-123-4567")).toBe(false)
      expect(validatePhone("(555) 123-456")).toBe(false)
      expect(validatePhone("invalid")).toBe(false)
    })

    it("should validate player age for session age group", () => {
      const validatePlayerAge = (playerAge: number, sessionAgeGroup: string) => {
        const ageRanges = {
          U13: { min: 10, max: 13 },
          U14: { min: 11, max: 14 },
          U15: { min: 12, max: 15 },
          U16: { min: 13, max: 16 },
        }
        const range = ageRanges[sessionAgeGroup as keyof typeof ageRanges]
        return range && playerAge >= range.min && playerAge <= range.max
      }

      expect(validatePlayerAge(12, "U13")).toBe(true)
      expect(validatePlayerAge(15, "U13")).toBe(false)
      expect(validatePlayerAge(16, "U16")).toBe(true)
      expect(validatePlayerAge(10, "U16")).toBe(false)
    })
  })

  describe("Session Status Logic", () => {
    it("should determine session status based on participants", () => {
      const getSessionStatus = (currentParticipants: number, maxParticipants: number) => {
        if (currentParticipants >= maxParticipants) return "full"
        return "open"
      }

      expect(getSessionStatus(8, 12)).toBe("open")
      expect(getSessionStatus(12, 12)).toBe("full")
      expect(getSessionStatus(15, 12)).toBe("full")
    })

    it("should calculate spots remaining", () => {
      const getSpotsRemaining = (maxParticipants: number, currentParticipants: number) => {
        return Math.max(0, maxParticipants - currentParticipants)
      }

      expect(getSpotsRemaining(12, 8)).toBe(4)
      expect(getSpotsRemaining(10, 10)).toBe(0)
      expect(getSpotsRemaining(8, 12)).toBe(0)
    })

    it("should calculate session fill percentage", () => {
      const getFillPercentage = (currentParticipants: number, maxParticipants: number) => {
        return Math.min(100, (currentParticipants / maxParticipants) * 100)
      }

      expect(getFillPercentage(8, 12)).toBeCloseTo(66.67, 2)
      expect(getFillPercentage(12, 12)).toBe(100)
      expect(getFillPercentage(0, 12)).toBe(0)
    })
  })
})
