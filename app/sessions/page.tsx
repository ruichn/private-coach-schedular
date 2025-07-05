import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

const sessions = [
  {
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
  },
  {
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
  },
  {
    id: 3,
    ageGroup: "U15",
    subgroup: "Competitive",
    date: "2024-01-17",
    time: "5:00 PM - 7:00 PM",
    location: "Volleyball Academy",
    address: "789 Court Rd, New York, NY",
    maxParticipants: 12,
    currentParticipants: 6,
    price: 35,
    focus: "Tournament Preparation",
    status: "open",
  },
  {
    id: 4,
    ageGroup: "U16",
    subgroup: "Elite",
    date: "2024-01-18",
    time: "6:30 PM - 8:30 PM",
    location: "Premier Training Facility",
    address: "321 Elite Blvd, New York, NY",
    maxParticipants: 8,
    currentParticipants: 7,
    price: 40,
    focus: "Advanced Techniques & Strategy",
    status: "open",
  },
  {
    id: 5,
    ageGroup: "U13",
    subgroup: "Intermediate",
    date: "2024-01-19",
    time: "3:30 PM - 5:00 PM",
    location: "Community Center",
    address: "654 Community Dr, New York, NY",
    maxParticipants: 12,
    currentParticipants: 9,
    price: 25,
    focus: "Game Play & Teamwork",
    status: "open",
  },
  {
    id: 6,
    ageGroup: "U14",
    subgroup: "Advanced",
    date: "2024-01-20",
    time: "10:00 AM - 11:30 AM",
    location: "Central High School Gym",
    address: "123 Main St, New York, NY",
    maxParticipants: 10,
    currentParticipants: 4,
    price: 30,
    focus: "Spiking & Blocking",
    status: "open",
  },
]

export default function SessionsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
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
            Coach Robe Volleyball
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/sessions" className="text-sm font-medium hover:text-gray-600">
              Sessions
            </Link>
            <Link href="/coaches" className="text-sm font-medium hover:text-gray-600">
              Programs
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-gray-600">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Coach Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Upcoming Training Sessions</h1>
            <p className="text-gray-600 mt-2">Join Coach Robe for professional volleyball training</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Showing {sessions.length} sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {session.ageGroup} - {session.subgroup}
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
                  <span>{formatDate(session.date)}</span>
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
                  <div className="font-bold text-lg">${session.price}</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <div className="pt-2">
                  <Link href={`/sessions/${session.id}/signup`}>
                    <Button className="w-full" disabled={session.status === "full"}>
                      {session.status === "full" ? "Session Full" : "Sign Up"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Don't see a session that fits your schedule?</p>
          <Link href="/contact">
            <Button variant="outline">Contact Coach Robe</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
