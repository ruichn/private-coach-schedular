import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Calendar, ArrowRight } from "lucide-react"
import CoachFilters from "@/components/coach-filters"

const coaches = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Fitness & Wellness Coach",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.9,
    specialties: ["HIIT", "Yoga", "Nutrition"],
    minGroupSize: 4,
    maxGroupSize: 12,
    sessionLength: 60,
    hourlyRate: 85,
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Business Strategy Coach",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.8,
    specialties: ["Leadership", "Team Building", "Strategic Planning"],
    minGroupSize: 3,
    maxGroupSize: 10,
    sessionLength: 90,
    hourlyRate: 120,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "Life & Career Coach",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.7,
    specialties: ["Career Transition", "Work-Life Balance", "Goal Setting"],
    minGroupSize: 2,
    maxGroupSize: 8,
    sessionLength: 75,
    hourlyRate: 95,
  },
  {
    id: 4,
    name: "David Thompson",
    title: "Sports Performance Coach",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.9,
    specialties: ["Basketball", "Strength Training", "Agility"],
    minGroupSize: 5,
    maxGroupSize: 15,
    sessionLength: 90,
    hourlyRate: 110,
  },
  {
    id: 5,
    name: "Aisha Patel",
    title: "Mindfulness & Meditation Coach",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.8,
    specialties: ["Stress Reduction", "Meditation", "Breathwork"],
    minGroupSize: 3,
    maxGroupSize: 12,
    sessionLength: 60,
    hourlyRate: 75,
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Public Speaking Coach",
    image: "/placeholder.svg?height=300&width=500",
    rating: 4.9,
    specialties: ["Presentation Skills", "Confidence Building", "Storytelling"],
    minGroupSize: 2,
    maxGroupSize: 8,
    sessionLength: 120,
    hourlyRate: 150,
  },
]

export default function CoachesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            CoachConnect
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/coaches" className="text-sm font-medium hover:text-gray-600">
              Find Coaches
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-gray-600">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-gray-600">
              About Us
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
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
          <h1 className="text-3xl font-bold">Find Your Coach</h1>
          <p className="text-gray-500">Showing {coaches.length} coaches</p>
        </div>

        <CoachFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {coaches.map((coach) => (
            <Card key={coach.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img src={coach.image || "/placeholder.svg"} alt={coach.name} className="object-cover w-full h-full" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{coach.name}</CardTitle>
                    <p className="text-gray-600">{coach.title}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{coach.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                  {coach.specialties.length > 3 && (
                    <Badge variant="outline">+{coach.specialties.length - 3} more</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    Group size: {coach.minGroupSize}-{coach.maxGroupSize} people
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Session length: {coach.sessionLength} minutes</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="font-bold">${coach.hourlyRate}/hour</div>
                <Link href={`/coaches/${coach.id}`}>
                  <Button>
                    View Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" className="mr-2 bg-transparent">
            Previous
          </Button>
          <Button variant="outline" className="mx-1 bg-transparent">
            1
          </Button>
          <Button variant="default" className="mx-1">
            2
          </Button>
          <Button variant="outline" className="mx-1 bg-transparent">
            3
          </Button>
          <Button variant="outline" className="ml-2 bg-transparent">
            Next
          </Button>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">CoachConnect</h3>
              <p className="text-gray-400">Connecting groups with expert coaches for transformative experiences.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/coaches" className="text-gray-400 hover:text-white">
                    Find Coaches
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gray-400 hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
