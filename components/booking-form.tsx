"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingFormProps {
  coachId: number
  hourlyRate: number
}

export default function BookingForm({ coachId, hourlyRate }: BookingFormProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()
  const [duration, setDuration] = useState<string>("60")
  const [groupSize, setGroupSize] = useState<string>("5")
  const [sessionType, setSessionType] = useState<string>("in-person")

  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]

  const calculateTotal = () => {
    const durationHours = Number.parseInt(duration) / 60
    return hourlyRate * durationHours
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the booking data to your backend
    console.log({
      coachId,
      date,
      time,
      duration,
      groupSize,
      sessionType,
    })
    alert("Booking request submitted! In a real app, this would process the booking.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Group Session</CardTitle>
        <CardDescription>Select your preferred date, time, and group details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    // Disable dates in the past and Sundays in this example
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today || date.getDay() === 0
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time">
                  {time ? (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {time}
                    </div>
                  ) : (
                    "Select time"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Session Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-size" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Group Size
            </Label>
            <div className="flex items-center">
              <Input
                id="group-size"
                type="number"
                min="2"
                max="20"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                className="w-20 mr-3"
              />
              <span className="text-sm text-gray-500">people</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Session Type</Label>
            <RadioGroup value={sessionType} onValueChange={setSessionType} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person" className="cursor-pointer">
                  In-person
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual" className="cursor-pointer">
                  Virtual
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Session Fee</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Service Fee</span>
              <span>$10</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${calculateTotal() + 10}</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!date || !time || !duration || !groupSize}
          onClick={handleSubmit}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}
