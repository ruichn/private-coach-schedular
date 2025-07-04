import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Star, Users, Video } from "lucide-react"
import BookingForm from "@/components/booking-form"

export default function CoachProfile({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the coach data based on the ID
  const coach = {
    id: Number.parseInt(params.id),
    name: "Coach Robe",
    title: "Professional Volleyball Coach",
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Youth Development", "Skill Progression", "Team Building", "Competition Prep", "Mental Training"],
    minGroupSize: 4,
    maxGroupSize: 12,
    sessionLength: 60,
    hourlyRate: 85,
    location: "New York, NY",
    virtualAvailable: false,
    bio: "With over 15 years of experience coaching youth volleyball, Coach Robe has developed hundreds of players from beginner to elite levels. Specializing in age-appropriate training methods, he focuses on building strong fundamentals while developing each player's unique strengths. His programs have produced numerous scholarship athletes and championship teams.",
    experience: [
      {
        title: "Head Volleyball Coach",
        company: "Elite Volleyball Academy",
        period: "2015 - Present",
      },
      {
        title: "Assistant Volleyball Coach",
        company: "Premier Volleyball Club",
        period: "2012 - 2015",
      },
      {
        title: "Volleyball Camp Instructor",
        company: "Summer Sports Camps",
        period: "2010 - 2012",
      },
    ],
    certifications: [
      "USA Volleyball Certified Coach",
      "Youth Sports Safety Certified",
      "First Aid/CPR Certified",
      "Positive Coaching Alliance Certified",
    ],
    reviews: [
      {
        id: 1,
        name: "Jennifer L.",
        rating: 5,
        date: "June 15, 2023",
        comment: "Coach Robe is an amazing volleyball coach! My daughter has improved so much under his guidance.",
      },
      {
        id: 2,
        name: "Michael T.",
        rating: 5,
        date: "May 3, 2023",
        comment:
          "Our volleyball team hired Coach Robe for a 6-week training program. His expertise and enthusiasm pushed us to new levels.",
      },
      {
        id: 3,
        name: "Sophia R.",
        rating: 4,
        date: "April 22, 2023",
        comment:
          "Coach Robe led a wonderful volleyball clinic for our group of friends. He created a perfect balance of challenging drills and fun games.",
      },
    ],
    availability: {
      monday: ["6:00 PM - 8:00 PM"],
      tuesday: ["6:00 PM - 8:00 PM"],
      wednesday: ["6:00 PM - 8:00 PM"],
      thursday: ["6:00 PM - 8:00 PM"],
      friday: [],
      saturday: ["9:00 AM - 12:00 PM"],
      sunday: ["1:00 PM - 4:00 PM"],
    },
  }

  const ageGroup = {
    "10U": {
      name: "10 and Under",
      description: "Introduction to volleyball fundamentals for players aged 10 and under.",
      focus: ["Basic skills", "Fun games", "Teamwork"],
    },
    "12U": {
      name: "12 and Under",
      description: "Intermediate volleyball training for players aged 11-12.",
      focus: ["Skill development", "Game strategy", "Competition"],
    },
    "14U": {
      name: "14 and Under",
      description: "Advanced volleyball training for players aged 13-14.",
      focus: ["Advanced techniques", "Position specialization", "Tournament preparation"],
    },
  }[params.id] || {
    name: "Age Group Not Found",
    description: "No information available for this age group.",
    focus: [],
  }

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
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img
                    src={coach.image || "/placeholder.svg"}
                    alt={coach.name}
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h1 className="text-2xl font-bold">{coach.name}</h1>
                  <p className="text-gray-600 mb-2">{coach.title}</p>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{coach.rating}</span>
                      <span className="text-gray-500 ml-1">({coach.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-500">
                        {coach.minGroupSize}-{coach.maxGroupSize} people
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{coach.location}</span>
                      {coach.virtualAvailable && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          <Video className="h-3 w-3 mr-1" />
                          Virtual Available
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{coach.sessionLength} min sessions</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Available most weekdays and weekends</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">${coach.hourlyRate}/hour</div>
                    <div className="hidden md:block">
                      <Button size="lg">Book a Session</Button>
                    </div>
                  </div>

                  <div className="md:hidden mt-4">
                    <Button className="w-full" size="lg">
                      Book a Session
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="about" className="bg-white rounded-lg shadow-sm">
              <TabsList className="w-full border-b rounded-none p-0">
                <TabsTrigger value="about" className="flex-1 rounded-none py-3">
                  About
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex-1 rounded-none py-3">
                  Experience
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 rounded-none py-3">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="availability" className="flex-1 rounded-none py-3">
                  Availability
                </TabsTrigger>
                <TabsTrigger value="ageGroup" className="flex-1 rounded-none py-3">
                  {ageGroup.name}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="p-6">
                <h2 className="text-xl font-bold mb-4">About {coach.name}</h2>
                <p className="mb-6">{coach.bio}</p>

                <h3 className="text-lg font-bold mb-3">Certifications</h3>
                <ul className="list-disc pl-5 mb-6 space-y-1">
                  {coach.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold mb-3">What to Expect</h3>
                <p className="mb-4">
                  My group sessions are designed to be inclusive, energetic, and effective. Here's what you can expect:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Initial assessment to understand your group's fitness levels and goals</li>
                  <li>Customized workout plans that accommodate different abilities</li>
                  <li>Progressive challenges to keep everyone engaged and motivated</li>
                  <li>Nutritional guidance and wellness tips to complement physical training</li>
                  <li>Regular check-ins to track progress and adjust as needed</li>
                </ul>
              </TabsContent>

              <TabsContent value="experience" className="p-6">
                <h2 className="text-xl font-bold mb-4">Professional Experience</h2>
                <div className="space-y-6">
                  {coach.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <h3 className="font-bold">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.period}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Client Reviews</h2>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-bold text-lg">{coach.rating}</span>
                    <span className="text-gray-500 ml-1">({coach.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {coach.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="mt-4 w-full bg-transparent">
                  See All Reviews
                </Button>
              </TabsContent>

              <TabsContent value="availability" className="p-6">
                <h2 className="text-xl font-bold mb-4">Weekly Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(coach.availability).map(([day, times]) => (
                    <Card key={day} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="bg-gray-100 p-3 font-medium capitalize">{day}</div>
                        <div className="p-3">
                          {times.length > 0 ? (
                            <ul className="space-y-1">
                              {times.map((time, index) => (
                                <li key={index} className="text-sm">
                                  {time}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">Not available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  * Times shown are in your local timezone. Availability may change based on bookings.
                </p>
              </TabsContent>
              <TabsContent value="ageGroup" className="p-6">
                <h2 className="text-xl font-bold mb-4">{ageGroup.name}</h2>
                <p className="mb-6">{ageGroup.description}</p>

                <h3 className="text-lg font-bold mb-3">Focus Areas</h3>
                <ul className="list-disc pl-5 mb-6 space-y-1">
                  {ageGroup.focus.map((focus, index) => (
                    <li key={index}>{focus}</li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <BookingForm coachId={coach.id} hourlyRate={coach.hourlyRate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
