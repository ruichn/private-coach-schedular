import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getSessions() {
  const sessions = await prisma.session.findMany({
    include: {
      registrations: true,
    },
    orderBy: {
      date: 'asc',
    },
  })

  return sessions.map(session => ({
    id: session.id,
    ageGroup: session.ageGroup,
    subgroup: session.subgroup,
    date: session.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    time: session.time,
    location: session.location,
    address: session.address,
    maxParticipants: session.maxParticipants,
    currentParticipants: session.registrations.length,
    price: session.price,
    focus: session.focus,
    status: session.registrations.length >= session.maxParticipants ? 'full' : 'open',
  }))
}

export default async function SessionsPage() {
  const sessions = await getSessions()
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
            <Link href="/about" className="text-sm font-medium hover:text-gray-600">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-gray-600">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Coach Login
              </Button>
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

        <div className="mt-12 text-center space-y-6">
          <div>
            <p className="text-gray-600 mb-4">Don't see a session that fits your schedule?</p>
            <Link href="/contact">
              <Button variant="outline">Contact Coach Robe</Button>
            </Link>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-gray-600 mb-4">Need to cancel a registration?</p>
            <Link href="/cancel">
              <Button variant="outline">Cancel Registration</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
