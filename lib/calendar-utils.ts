/**
 * Utility functions for generating calendar events
 */

import { parseSessionDate } from '@/lib/date-utils'

export interface CalendarEvent {
  title: string
  description: string
  location: string
  address?: string
  startDate: Date
  endDate: Date
  url?: string
}

/**
 * Parse time string like "1:00 PM - 2:30 PM" and return start/end times
 */
function parseTimeRange(timeString: string, date: string): { start: Date; end: Date } {
  const [startTime, endTime] = timeString.split(' - ')
  
  const parseTime = (time: string, dateStr: string): Date => {
    try {
      const [timePart, period] = time.trim().split(' ')
      const [hours, minutes] = timePart.split(':').map(Number)
      
      if (isNaN(hours) || (minutes !== undefined && isNaN(minutes))) {
        throw new Error(`Invalid time format: ${time}`)
      }
      
      let hour24 = hours
      if (period === 'PM' && hours !== 12) {
        hour24 += 12
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0
      }
      
      // Parse date in local timezone
      let datePart: string
      if (dateStr.includes('T')) {
        datePart = dateStr.split('T')[0]
      } else {
        datePart = dateStr
      }
      
      // Create date in local timezone
      const [year, month, day] = datePart.split('-').map(Number)
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(`Invalid date format: ${dateStr}`)
      }
      
      const eventDate = new Date(year, month - 1, day, hour24, minutes || 0, 0, 0)
      
      if (isNaN(eventDate.getTime())) {
        throw new Error(`Failed to create valid date: ${dateStr} ${time}`)
      }
      
      return eventDate
    } catch (error) {
      console.error('Error parsing time:', { time, dateStr, error })
      throw error
    }
  }
  
  return {
    start: parseTime(startTime, date),
    end: parseTime(endTime, date)
  }
}

/**
 * Generate ICS calendar file content
 */
export function generateICS(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    if (!date || isNaN(date.getTime())) {
      console.error('Invalid date in generateICS:', { date, type: typeof date })
      throw new Error(`Invalid date provided to calendar event: ${date}`)
    }
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escape = (text: string): string => {
    return text.replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n')
  }

  const venueName = event.location.split('(')[0].trim()
  const mapsQuery = venueName || event.location || event.address || ''
  const appleGeoUri = mapsQuery ? `geo:?q=${encodeURIComponent(mapsQuery)}` : ''

  const descriptionWithMap = escape(event.description)

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Coach Robe Training//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@coach-robe-training.com`,
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${descriptionWithMap}`,
    event.location && `LOCATION:${escape(event.location)}`,
    appleGeoUri && `X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-APPLE-RADIUS=0;X-TITLE="${escape(venueName || event.location)}":${appleGeoUri}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n')

  return ics
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarURL(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    if (!date || isNaN(date.getTime())) {
      throw new Error('Invalid date provided to calendar event')
    }
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(event.startDate)}/${formatDate(event.endDate)}`,
    details: event.description,
    location: event.location,
    ...(event.url && { sprop: `website:${event.url}` })
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generate Outlook Calendar URL
 */
export function generateOutlookCalendarURL(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    if (!date || isNaN(date.getTime())) {
      throw new Error('Invalid date provided to calendar event')
    }
    return date.toISOString()
  }
  
  const params = new URLSearchParams({
    subject: event.title,
    startdt: formatDate(event.startDate),
    enddt: formatDate(event.endDate),
    body: event.description,
    location: event.location,
    ...(event.url && { allday: 'false' })
  })
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Create calendar event from session data
 */
export function createCalendarEvent(session: {
  id: number
  sport: string
  ageGroup: string
  date: string
  time: string
  location: string
  address?: string
  focus?: string
  price?: number
}): CalendarEvent {
  const { start, end } = parseTimeRange(session.time, session.date)

  const title = `${session.sport.charAt(0).toUpperCase() + session.sport.slice(1)} Training - ${session.ageGroup}`

  const locationField = session.location && session.address
    ? `${session.location} (${session.address})`
    : session.address || session.location || ''

  const mapQuery = session.location || session.address || ''
  const mapLink = mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : ''

  const description = [
    `Coach Robe ${session.sport} training session for ${session.ageGroup} players.`,
    session.focus && `Focus: ${session.focus}`,
    session.price && session.price > 0 && `Price: $${session.price}`,
    '',
    'Please arrive 10 minutes early for warm-up.',
    'For questions, contact Coach Robe.'
  ].filter(Boolean).join('\n')

  // Use just the location name for calendar display
  // Store full address for map URL generation
  return {
    title,
    description,
    location: locationField,
    address: session.address,
    startDate: start,
    endDate: end
  }
}

/**
 * Download ICS file
 */
export function downloadICS(event: CalendarEvent, filename?: string): void {
  const icsContent = generateICS(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}
