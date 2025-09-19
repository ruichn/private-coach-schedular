"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import Navigation from "@/components/ui/navigation"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission (in real app, this would send an email)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/contact" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Coach Robe</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our volleyball training programs? Ready to get started? 
              We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Get In Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a 
                        href="mailto:Robe@PodioSports.org" 
                        className="text-blue-600 hover:underline"
                      >
                        Robe@PodioSports.org
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        Best way to reach us for questions or scheduling
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Training Location</h3>
                      <p className="text-gray-600">The Overlake School Gym</p>
                      <p className="text-sm text-gray-600">
                        20301 NE 108th St, Redmond, WA 98053
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Response Time</h3>
                      <p className="text-gray-600">Within 24 hours</p>
                      <p className="text-sm text-gray-600 mt-1">
                        We'll get back to you as soon as possible
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">What should players bring to training?</h4>
                    <p className="text-sm text-gray-600">Athletic wear, water bottle, and volleyball shoes (if available). Volleyballs are provided.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">What if my child has no volleyball experience?</h4>
                    <p className="text-sm text-gray-600">Perfect! Our beginner programs are designed for players with no prior experience.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Can I get a refund if my child can't attend?</h4>
                    <p className="text-sm text-gray-600">Please contact us as soon as possible to discuss options for rescheduling or refunds.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                      <p className="text-gray-600 mb-4">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                      <Button onClick={() => setSubmitted(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            placeholder="What's this about?"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          placeholder="Tell us about your questions, goals, or anything else we should know..."
                          rows={6}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <p className="text-sm text-gray-600 text-center">
                        You can also email us directly at{" "}
                        <a 
                          href="mailto:Robe@PodioSports.org" 
                          className="text-blue-600 hover:underline"
                        >
                          Robe@PodioSports.org
                        </a>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
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