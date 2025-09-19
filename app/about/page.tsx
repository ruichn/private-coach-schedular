import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Users, Award, MapPin, Calendar } from "lucide-react"
import Navigation from "@/components/ui/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/about" />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">About Coach Robe</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering young athletes to pursue excellence, legacy, and purpose through volleyball
          </p>
        </div>

        {/* Core Philosophy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Core Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Power</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pushing limits, fueling drive, and owning the game. We believe in developing 
                  physical and mental strength that translates beyond the court.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Leading with intention, heart, and grit. Every training session has meaning, 
                  every drill builds character, and every athlete discovers their potential.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Podium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Not just aiming to finish, but stepping up and setting standards. We prepare 
                  athletes to excel at the highest levels of competition.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Coach Robe */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Meet Coach Robe</h2>
            <p className="text-xl text-gray-600">
              Founder of Podio Sports and dedicated volleyball coach
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Background & Experience</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Coach Robe brings extensive experience in both basketball and volleyball coaching. 
                    Currently coaching at The Overlake School in Redmond, WA, he has previously founded 
                    CITY Volleyball in Los Angeles and has coached with renowned programs including 
                    LAVA Volleyball and Sunshine North.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Coaching Philosophy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Coach Robe believes in developing the complete athlete. His approach combines 
                    technical skill development with character building, ensuring athletes grow 
                    not just as players, but as leaders and individuals with purpose.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    Current Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Volleyball Coach</p>
                  <p className="text-gray-600">The Overlake School, Redmond, WA</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Coaching Achievements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Championship Success</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Multiple CIF championships in volleyball, basketball, and tennis</li>
                  <li>• Led 15s team to championship at Las Vegas Showcase</li>
                  <li>• Coached teams to Junior Nationals in Open Division</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Player Development</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Developed 11 Division I collegiate athletes through CITY Volleyball</li>
                  <li>• High-level tournament performances</li>
                  <li>• Consistent player advancement to competitive levels</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Coaching Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Collegiate level coaching (Concordia University)</li>
                  <li>• International experience (Grenada national team)</li>
                  <li>• Training camps in Italy and Canada</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">LAVA Volleyball</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">Sunshine North</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">Concordia University</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">The Overlake School</Badge>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                To empower young athletes to pursue excellence, legacy, and purpose through sport. 
                We believe that volleyball is more than a game—it's a vehicle for personal growth, 
                character development, and building lifelong values.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sessions">
                  <Button size="lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    View Training Sessions
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-bold text-lg mb-4">Coach Robe Volleyball</h3>
          <p className="text-gray-400 mb-4">Professional volleyball training for youth athletes</p>
          <p className="text-gray-400">
            Contact us at{" "}
            <a 
              href="mailto:Robe@PodioSports.org" 
              className="text-white hover:underline"
            >
              Robe@PodioSports.org
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}