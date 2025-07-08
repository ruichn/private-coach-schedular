// Unit tests for date and time utilities
import { describe, it, expect } from "@jest/globals"

describe("Date and Time Utilities", () => {
  describe("Date Formatting", () => {
    it("should format date for display", () => {
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      }

      expect(formatDate("2024-01-15")).toBe("Monday, January 15, 2024")
      expect(formatDate("2024-12-25")).toBe("Wednesday, December 25, 2024")
    })

    it("should parse time strings correctly", () => {
      const parseTimeRange = (timeString: string) => {
        const [start, end] = timeString.split(" - ")
        return { start, end }
      }

      const result = parseTimeRange("4:00 PM - 5:30 PM")
      expect(result.start).toBe("4:00 PM")
      expect(result.end).toBe("5:30 PM")
    })

    it("should calculate session duration", () => {
      const calculateDuration = (timeString: string) => {
        const [start, end] = timeString.split(" - ")
        const startTime = new Date(`2024-01-01 ${start}`)
        const endTime = new Date(`2024-01-01 ${end}`)
        return (endTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes
      }

      expect(calculateDuration("4:00 PM - 5:30 PM")).toBe(90)
      expect(calculateDuration("6:00 PM - 8:00 PM")).toBe(120)
    })
  })

  describe("Date Validation", () => {
    it("should check if date is in the future", () => {
      const isFutureDate = (dateString: string) => {
        const sessionDate = new Date(dateString)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return sessionDate >= today
      }

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      expect(isFutureDate(tomorrow.toISOString().split("T")[0])).toBe(true)
      expect(isFutureDate(yesterday.toISOString().split("T")[0])).toBe(false)
    })

    it("should check if date is not a Sunday", () => {
      const isNotSunday = (dateString: string) => {
        const date = new Date(dateString)
        return date.getDay() !== 0
      }

      expect(isNotSunday("2024-01-15")).toBe(true) // Monday
      expect(isNotSunday("2024-01-14")).toBe(false) // Sunday
    })
  })
})
