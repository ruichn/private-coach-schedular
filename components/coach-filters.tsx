"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"

export default function CoachFilters() {
  const [priceRange, setPriceRange] = useState([50, 200])
  const [groupSize, setGroupSize] = useState(5)
  const [showFilters, setShowFilters] = useState(false)

  const specialties = [
    "Serving",
    "Spiking",
    "Setting",
    "Blocking",
    "Digging",
    "Passing",
    "Team Strategy",
    "Conditioning",
    "Fundamentals",
    "Advanced Techniques",
  ]

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-96">
          <Input placeholder="Search by age group or training focus..." className="pl-10" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="recommended">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="rating-high">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="availability">Availability</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Coaches</SheetTitle>
                <SheetDescription>Narrow down coaches based on your preferences</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Price Range (per hour)</h3>
                  <div className="space-y-4">
                    <Slider defaultValue={priceRange} max={300} min={20} step={5} onValueChange={setPriceRange} />
                    <div className="flex items-center justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Team Size</h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[groupSize]}
                      max={20}
                      min={2}
                      step={1}
                      onValueChange={(value) => setGroupSize(value[0])}
                    />
                    <div className="flex items-center justify-between">
                      <span>Min: 2</span>
                      <span>Selected: {groupSize}</span>
                      <span>Max: 20</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Age Group</h3>
                  <Select defaultValue="All Ages">
                    <SelectTrigger>
                      <SelectValue placeholder="All Ages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Ages">All Ages</SelectItem>
                      <SelectItem value="U13">U13</SelectItem>
                      <SelectItem value="U14">U14</SelectItem>
                      <SelectItem value="U15">U15</SelectItem>
                      <SelectItem value="U16">U16</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Session Length</h3>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any duration</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Specialties</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {specialties.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox id={specialty} />
                        <Label htmlFor={specialty} className="text-sm">
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="weekdays" />
                      <Label htmlFor="weekdays">Weekdays</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="weekends" />
                      <Label htmlFor="weekends">Weekends</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="evenings" />
                      <Label htmlFor="evenings">Evenings</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Session Type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-person" />
                      <Label htmlFor="in-person">Indoor Training</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="virtual" />
                      <Label htmlFor="virtual">Outdoor Training</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hybrid" />
                      <Label htmlFor="hybrid">Tournament Prep</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([50, 200])
                    setGroupSize(5)
                  }}
                >
                  Reset All
                </Button>
                <Button>Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="secondary" size="sm" className="rounded-full">
            Price: $50-$200
            <X className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full">
            Group Size: 5+
            <X className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full">
            Fitness
            <X className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
