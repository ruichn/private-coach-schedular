"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, ChevronDown, CalendarPlus } from "lucide-react"
import { 
  createCalendarEvent, 
  generateGoogleCalendarURL, 
  generateOutlookCalendarURL, 
  downloadICS 
} from "@/lib/calendar-utils"

interface AddToCalendarProps {
  session: {
    id: number
    sport: string
    ageGroup: string
    date: string
    time: string
    location: string
    address?: string
    focus?: string
    price?: number
  }
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  children?: React.ReactNode
}

export function AddToCalendar({ 
  session, 
  variant = "outline", 
  size = "sm",
  className = "",
  children
}: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddToCalendar = (type: 'google' | 'outlook' | 'ics') => {
    const event = createCalendarEvent(session)

    switch (type) {
      case 'google':
        window.open(generateGoogleCalendarURL(event), '_blank')
        break
      case 'outlook':
        window.open(generateOutlookCalendarURL(event), '_blank')
        break
      case 'ics':
        downloadICS(event)
        break
    }

    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
        >
          {children || (
            <>
              <CalendarPlus className="h-4 w-4" />
              <ChevronDown className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleAddToCalendar('google')}
          className="cursor-pointer"
        >
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-blue-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            Google Calendar
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAddToCalendar('outlook')}
          className="cursor-pointer"
        >
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">O</span>
            </div>
            Outlook Calendar
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAddToCalendar('ics')}
          className="cursor-pointer"
        >
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-600" />
            Download .ics file
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}