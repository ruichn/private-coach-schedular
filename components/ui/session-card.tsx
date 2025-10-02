import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, CalendarPlus, ArrowRight } from "lucide-react"
import { formatSessionDate } from "@/lib/date-utils"
import { AddToCalendar } from "@/components/ui/add-to-calendar"

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

interface SessionCardProps {
  session: Session
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

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {session.sport?.charAt(0).toUpperCase() + session.sport?.slice(1)} - {session.ageGroup}
            </CardTitle>
            {session.price > 0 && (
              <div className="font-bold mt-1">${session.price}</div>
            )}
            <p className="text-sm text-gray-600 mt-1">{session.focus}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link href={`/sessions/${session.id}/signup`}>
              <Button size="sm" disabled={session.status === "full"}>
                {session.status === "full" ? "Session Full" : "Sign Up"}
                {session.status !== "full" && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </Link>
            <Badge className={getStatusColor(session.status)}>
              {session.maxParticipants - session.currentParticipants} spots left
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <AddToCalendar
          session={{
            id: session.id,
            sport: session.sport,
            ageGroup: session.ageGroup,
            date: session.date,
            time: session.time,
            location: session.location,
            address: session.address,
            focus: session.focus,
            price: session.price
          }}
          variant="ghost"
          size="sm"
          className="w-full h-auto items-start justify-start px-0 py-0 text-left transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm">
              <CalendarPlus className="h-4 w-4 mr-2 text-blue-600" />
              <span>{formatSessionDate(session.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{session.time}</span>
            </div>
          </div>
        </AddToCalendar>

        <div className="flex items-start text-sm">
          <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
          <div>
            <div className="font-medium">{session.location}</div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(session.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {session.address}
            </a>
          </div>
        </div>

        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <span>
            {session.currentParticipants}/{session.maxParticipants} players
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  )
}
