// Integration tests for session management
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import type { TestSession, TestParticipant } from "../types/test-types"

describe("Session Management Integration", () => {
  let sessions: TestSession[]
  let participants: TestParticipant[]

  beforeEach(() => {
    sessions = [
      {
        id: 1,
        ageGroup: "U13",
        subgroup: "Beginners",
        date: "2024-01-15",
        time: "4:00 PM - 5:30 PM",
        location: "Central High School Gym",
        address: "123 Main St, New York, NY",
        maxParticipants: 12,
        currentParticipants: 2,
        price: 25,
        focus: "Basic Skills & Fundamentals",
        status: "open",
      },
    ]

    participants = [
      {
        id: 1,
        sessionId: 1,
        playerName: "Emma Johnson",
        playerAge: 12,
        parentName: "Sarah Johnson",
        parentEmail: "sarah.johnson@email.com",
        parentPhone: "(555) 123-4567",
        emergencyContact: "Mike Johnson",
        emergencyPhone: "(555) 987-6543",
        registrationDate: "2024-01-10",
      },
      {
        id: 2,
        sessionId: 1,
        playerName: "Olivia Smith",
        playerAge: 13,
        parentName: "Mike Smith",
        parentEmail: "mike.smith@email.com",
        parentPhone: "(555) 234-5678",
        emergencyContact: "Lisa Smith",
        emergencyPhone: "(555) 876-5432",
        registrationDate: "2024-01-11",
      },
    ]
  })

  afterEach(() => {
    sessions = []
    participants = []
  })

  describe("Session Creation", () => {
    it("should create a new session successfully", () => {
      const createSession = (sessionData: Omit<TestSession, "id" | "currentParticipants" | "status">) => {
        const newSession: TestSession = {
          ...sessionData,
          id: sessions.length + 1,
          currentParticipants: 0,
          status: "open",
        }
        sessions.push(newSession)
        return newSession
      }

      const newSessionData = {
        ageGroup: "U14",
        subgroup: "Intermediate",
        date: "2024-01-20",
        time: "6:00 PM - 7:30 PM",
        location: "Elite Sports Center",
        address: "456 Sports Ave, New York, NY",
        maxParticipants: 10,
        price: 30,
        focus: "Serving & Passing Techniques",
      }

      const createdSession = createSession(newSessionData)

      expect(createdSession.id).toBe(2)
      expect(createdSession.currentParticipants).toBe(0)
      expect(createdSession.status).toBe("open")
      expect(sessions).toHaveLength(2)
    })

    it("should prevent creating sessions with invalid data", () => {
      const createSession = (sessionData: any) => {
        // Validation logic
        if (!sessionData.ageGroup || !sessionData.subgroup || !sessionData.date) {
          throw new Error("Missing required fields")
        }
        if (sessionData.maxParticipants <= 0 || sessionData.maxParticipants > 20) {
          throw new Error("Invalid participant limit")
        }
        if (sessionData.price <= 0) {
          throw new Error("Invalid price")
        }

        const newSession: TestSession = {
          ...sessionData,
          id: sessions.length + 1,
          currentParticipants: 0,
          status: "open",
        }
        sessions.push(newSession)
        return newSession
      }

      expect(() => createSession({ ageGroup: "", subgroup: "Beginners" })).toThrow("Missing required fields")
      expect(() =>
        createSession({ ageGroup: "U13", subgroup: "Beginners", date: "2024-01-15", maxParticipants: 0 }),
      ).toThrow("Invalid participant limit")
      expect(() =>
        createSession({ ageGroup: "U13", subgroup: "Beginners", date: "2024-01-15", maxParticipants: 10, price: -5 }),
      ).toThrow("Invalid price")
    })
  })

  describe("Participant Registration", () => {
    it("should register a participant successfully", () => {
      const registerParticipant = (
        sessionId: number,
        participantData: Omit<TestParticipant, "id" | "sessionId" | "registrationDate">,
      ) => {
        const session = sessions.find((s) => s.id === sessionId)
        if (!session) throw new Error("Session not found")
        if (session.currentParticipants >= session.maxParticipants) throw new Error("Session is full")

        const newParticipant: TestParticipant = {
          ...participantData,
          id: participants.length + 1,
          sessionId,
          registrationDate: new Date().toISOString().split("T")[0],
        }

        participants.push(newParticipant)
        session.currentParticipants++

        if (session.currentParticipants >= session.maxParticipants) {
          session.status = "full"
        }

        return newParticipant
      }

      const participantData = {
        playerName: "Ava Brown",
        playerAge: 12,
        parentName: "Lisa Brown",
        parentEmail: "lisa.brown@email.com",
        parentPhone: "(555) 345-6789",
        emergencyContact: "Tom Brown",
        emergencyPhone: "(555) 765-4321",
      }

      const registered = registerParticipant(1, participantData)

      expect(registered.id).toBe(3)
      expect(registered.sessionId).toBe(1)
      expect(participants).toHaveLength(3)
      expect(sessions[0].currentParticipants).toBe(3)
      expect(sessions[0].status).toBe("open")
    })

    it("should prevent registration when session is full", () => {
      const registerParticipant = (sessionId: number, participantData: any) => {
        const session = sessions.find((s) => s.id === sessionId)
        if (!session) throw new Error("Session not found")
        if (session.currentParticipants >= session.maxParticipants) throw new Error("Session is full")

        // Registration logic would go here
        return true
      }

      // Fill the session to capacity
      sessions[0].currentParticipants = 12
      sessions[0].status = "full"

      const participantData = {
        playerName: "Test Player",
        playerAge: 12,
        parentName: "Test Parent",
        parentEmail: "test@email.com",
        parentPhone: "(555) 000-0000",
        emergencyContact: "Emergency Contact",
        emergencyPhone: "(555) 111-1111",
      }

      expect(() => registerParticipant(1, participantData)).toThrow("Session is full")
    })

    it("should update session status when reaching capacity", () => {
      const session = sessions[0]
      session.currentParticipants = 11 // One spot left

      const registerParticipant = (sessionId: number) => {
        const session = sessions.find((s) => s.id === sessionId)
        if (!session) throw new Error("Session not found")

        session.currentParticipants++
        if (session.currentParticipants >= session.maxParticipants) {
          session.status = "full"
        }
        return session
      }

      const updatedSession = registerParticipant(1)
      expect(updatedSession.currentParticipants).toBe(12)
      expect(updatedSession.status).toBe("full")
    })
  })

  describe("Session Queries", () => {
    it("should get sessions by age group", () => {
      const getSessionsByAgeGroup = (ageGroup: string) => {
        return sessions.filter((session) => session.ageGroup === ageGroup)
      }

      // Add another session for testing
      sessions.push({
        id: 2,
        ageGroup: "U14",
        subgroup: "Intermediate",
        date: "2024-01-16",
        time: "6:00 PM - 7:30 PM",
        location: "Elite Sports Center",
        address: "456 Sports Ave, New York, NY",
        maxParticipants: 10,
        currentParticipants: 5,
        price: 30,
        focus: "Serving & Passing Techniques",
        status: "open",
      })

      const u13Sessions = getSessionsByAgeGroup("U13")
      const u14Sessions = getSessionsByAgeGroup("U14")

      expect(u13Sessions).toHaveLength(1)
      expect(u14Sessions).toHaveLength(1)
      expect(u13Sessions[0].ageGroup).toBe("U13")
    })

    it("should get participants for a session", () => {
      const getSessionParticipants = (sessionId: number) => {
        return participants.filter((participant) => participant.sessionId === sessionId)
      }

      const sessionParticipants = getSessionParticipants(1)
      expect(sessionParticipants).toHaveLength(2)
      expect(sessionParticipants.every((p) => p.sessionId === 1)).toBe(true)
    })

    it("should get available sessions (not full)", () => {
      const getAvailableSessions = () => {
        return sessions.filter((session) => session.status === "open")
      }

      // Add a full session
      sessions.push({
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
      })

      const availableSessions = getAvailableSessions()
      expect(availableSessions).toHaveLength(1)
      expect(availableSessions[0].status).toBe("open")
    })
  })
})
