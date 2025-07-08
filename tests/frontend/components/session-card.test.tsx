"use client"

// Frontend component tests
import { describe, it, expect, vi } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"

// Mock session card component for testing
const SessionCard = ({ session, onSignUp }: { session: any; onSignUp: (id: number) => void }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
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
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const spotsRemaining = session.maxParticipants - session.currentParticipants

  return (
    <div data-testid="session-card" className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 data-testid="session-title">
          {session.ageGroup} - {session.subgroup}
        </h3>
        <span data-testid="status-badge" className={getStatusColor(session.status)}>
          {spotsRemaining} spots left
        </span>
      </div>

      <p data-testid="session-focus">{session.focus}</p>

      <div className="mt-2 space-y-1">
        <div data-testid="session-date">{formatDate(session.date)}</div>
        <div data-testid="session-time">{session.time}</div>
        <div data-testid="session-location">{session.location}</div>
        <div data-testid="session-address">{session.address}</div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div data-testid="participant-count">
          {session.currentParticipants}/{session.maxParticipants} players
        </div>
        <div data-testid="session-price">${session.price}</div>
      </div>

      <div className="mt-2">
        <div data-testid="progress-bar" className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
          />
        </div>
      </div>

      <button
        data-testid="signup-button"
        onClick={() => onSignUp(session.id)}
        disabled={session.status === "full"}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {session.status === "full" ? "Session Full" : "Sign Up"}
      </button>
    </div>
  )
}

describe("SessionCard Component", () => {
  const mockSession = {
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

  it("should render session information correctly", () => {
    const mockOnSignUp = vi.fn()
    render(<SessionCard session={mockSession} onSignUp={mockOnSignUp} />)

    expect(screen.getByTestId("session-title")).toHaveTextContent("U13 - Beginners")
    expect(screen.getByTestId("session-focus")).toHaveTextContent("Basic Skills & Fundamentals")
    expect(screen.getByTestId("session-date")).toHaveTextContent("Monday, January 15")
    expect(screen.getByTestId("session-time")).toHaveTextContent("4:00 PM - 5:30 PM")
    expect(screen.getByTestId("session-location")).toHaveTextContent("Central High School Gym")
    expect(screen.getByTestId("session-address")).toHaveTextContent("123 Main St, New York, NY")
    expect(screen.getByTestId("participant-count")).toHaveTextContent("8/12 players")
    expect(screen.getByTestId("session-price")).toHaveTextContent("$25")
  })

  it("should show correct spots remaining", () => {
    const mockOnSignUp = vi.fn()
    render(<SessionCard session={mockSession} onSignUp={mockOnSignUp} />)

    expect(screen.getByTestId("status-badge")).toHaveTextContent("4 spots left")
  })

  it("should display progress bar correctly", () => {
    const mockOnSignUp = vi.fn()
    render(<SessionCard session={mockSession} onSignUp={mockOnSignUp} />)

    const progressBar = screen.getByTestId("progress-bar").firstChild as HTMLElement
    expect(progressBar).toHaveStyle("width: 66.66666666666666%")
  })

  it("should handle sign up button click", () => {
    const mockOnSignUp = vi.fn()
    render(<SessionCard session={mockSession} onSignUp={mockOnSignUp} />)

    const signUpButton = screen.getByTestId("signup-button")
    fireEvent.click(signUpButton)

    expect(mockOnSignUp).toHaveBeenCalledWith(1)
  })

  it("should disable sign up button when session is full", () => {
    const fullSession = { ...mockSession, currentParticipants: 12, status: "full" }
    const mockOnSignUp = vi.fn()
    render(<SessionCard session={fullSession} onSignUp={mockOnSignUp} />)

    const signUpButton = screen.getByTestId("signup-button")
    expect(signUpButton).toBeDisabled()
    expect(signUpButton).toHaveTextContent("Session Full")
  })

  it("should show full status badge when session is full", () => {
    const fullSession = { ...mockSession, currentParticipants: 12, status: "full" }
    const mockOnSignUp = vi.fn()
    render(<SessionCard session={fullSession} onSignUp={mockOnSignUp} />)

    expect(screen.getByTestId("status-badge")).toHaveTextContent("0 spots left")
  })
})
