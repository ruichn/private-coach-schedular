import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import DynamicSessionSignup from "@/components/dynamic-session-signup"

interface SessionData {
  id: number
  sport: string
  ageGroup: string
  date: Date
  time: string
  location: string
  address: string
  maxParticipants: number
  currentParticipants: number
  price: number
  focus: string
  status: string
}

async function getSession(id: string): Promise<SessionData | null> {
  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: {
      registrations: true,
    },
  })

  if (!session) return null

  return {
    ...session,
    currentParticipants: session.registrations.length
  }
}

export default async function SessionSignup({ params }: { params: { id: string } }) {
  const session = await getSession(params.id)

  if (!session) {
    return <div>Session not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Coach Robe Sports Training
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

        <DynamicSessionSignup initialSession={session} />
      </main>
    </div>
  )
}
