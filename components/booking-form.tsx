"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  hourlyRate: number // Now represents the per-player rate
}

export default function BookingForm({ coachId, hourlyRate }: BookingFormProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()
  const [duration, setDuration] = useState<string>("90") // Default to 90 minutes
  const [numberOfPlayers, setNumberOfPlayers] = useState<string>("5")
  const [sessionType, setSessionType] = useState<string>("regular")
  const [ageGroup, setAgeGroup] = useState<string>("")
  const [subgroup, setSubgroup] = useState<string>("")

  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]

  const calculateTotal = () => {
    return hourlyRate * Number.parseInt(numberOfPlayers) // per-player pricing
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the booking data to your backend
    console.log({
      coachId,
      date,
      time,
      duration,
      numberOfPlayers,
      sessionType,
      ageGroup,
      subgroup,
    })
    alert("Booking request submitted! In a real app, this would process the booking.")
  }

  const subgroups = {
    U13: ["Beginner", "Intermediate", "Advanced"],
    U14: ["Beginner", "Intermediate", "Advanced"],
    U15: ["Developmental", "Competitive"],
    U16: ["Developmental", "Competitive"],
  }

  useEffect(() => {
    setSubgroup("") // Reset subgroup when ageGroup changes
    if (ageGroup === "U13" || ageGroup === "U14") {
      setDuration("90")
    } else if (ageGroup === "U15" || ageGroup === "U16") {
      setDuration("120")
    }
  }, [ageGroup])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Training Session</CardTitle>
        <CardDescription>Select your preferred date, time, and group details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age-group">Age Group</Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger id="age-group">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="U13">U13</SelectItem>
                <SelectItem value="U14">U14</SelectItem>
                <SelectItem value="U15">U15</SelectItem>
                <SelectItem value="U16">U16</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {ageGroup && (
            <div className="space-y-2">
              <Label htmlFor="subgroup">Subgroup</Label>
              <Select value={subgroup} onValueChange={setSubgroup}>
                <SelectTrigger id="subgroup">
                  <SelectValue placeholder="Select subgroup" />
                </SelectTrigger>
                <SelectContent>
                  {subgroups[ageGroup as keyof typeof subgroups]?.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
            <Select value={duration} onValueChange={setDuration} disabled={ageGroup === ""}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {ageGroup === "U13" || ageGroup === "U14" ? (
                  <SelectItem value="90">90 minutes</SelectItem>
                ) : (
                  <SelectItem value="120">120 minutes</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-size" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Number of Players
            </Label>
            <div className="flex items-center">
              <Input
                id="group-size"
                type="number"
                min="2"
                max="20"
                value={numberOfPlayers}
                onChange={(e) => setNumberOfPlayers(e.target.value)}
                className="w-20 mr-3"
              />
              <span className="text-sm text-gray-500">players</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Session Type</Label>
            <RadioGroup value={sessionType} onValueChange={setSessionType} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular" className="cursor-pointer">
                  Regular Training
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tournament" id="tournament" />
                <Label htmlFor="tournament" className="cursor-pointer">
                  Tournament Prep
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skills" id="skills" />
                <Label htmlFor="skills" className="cursor-pointer">
                  Skills Intensive
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
          disabled={!date || !time || !duration || !numberOfPlayers || !ageGroup || !subgroup}
          onClick={handleSubmit}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}
