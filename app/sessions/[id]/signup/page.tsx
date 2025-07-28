import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import SessionSignupForm from "@/components/session-signup-form"
import { formatSessionDate } from "@/lib/date-utils"

interface SessionData {
  id: number
  ageGroup: string
  subgroup: string
  date: Date
  time: string
  location: string
  address: string
  maxParticipants: number
  currentParticipants: number
  price: number
  focus: string
  status: string
  registrations: {
    playerName: string
    playerAge: number
    parentName: string
  }[]
}

async function getSession(id: string): Promise<SessionData | null> {
  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: {
      registrations: true,
    },
  })

  return session
}

export default async function SessionSignup({ params }: { params: { id: string } }) {
  const session = await getSession(params.id)

  if (!session) {
    return <div>Session not found</div>
  }


  const spotsRemaining = session.maxParticipants - session.currentParticipants

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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/sessions" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Session Details
                  <Badge className="bg-green-100 text-green-800">{spotsRemaining} spots left</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {session.ageGroup} - {session.subgroup}
                  </h3>
                  <p className="text-gray-600">{session.focus}</p>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formatSessionDate(session.date.toISOString().split('T')[0])}</span>
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {session.currentParticipants}/{session.maxParticipants} players
                    </span>
                  </div>
                  <div className="font-bold text-xl">${session.price}</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Current Participants:</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {session.registrations.map((registration, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{registration.playerName}</span>
                        <span className="text-gray-500"> (Age {registration.playerAge})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Player Registration</CardTitle>
                <p className="text-gray-600">Fill out the form below to register for this training session.</p>
              </CardHeader>
              <CardContent>
                <SessionSignupForm sessionId={session.id} sessionPrice={session.price} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
