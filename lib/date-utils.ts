/**
 * Utility functions for handling dates consistently across the application
 * Fixes timezone offset issues when displaying dates
 */

export function formatSessionDate(dateString: string): string {
  // Handle both YYYY-MM-DD and full ISO date strings
  let date: Date
  
  if (dateString.includes('T')) {
    // Already has time component (from API) - extract just the date part to avoid timezone issues
    const datePart = dateString.split('T')[0] // Get "2025-08-03" from "2025-08-03T00:00:00.000Z"
    date = new Date(datePart + 'T12:00:00.000Z') // Use noon UTC to avoid timezone boundary issues
  } else {
    // Just date string (YYYY-MM-DD), parse as UTC
    date = new Date(dateString + 'T12:00:00.000Z')
  }
  
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatSessionDateShort(dateString: string): string {
  // Handle both YYYY-MM-DD and full ISO date strings
  let date: Date
  
  if (dateString.includes('T')) {
    // Already has time component (from API) - extract just the date part to avoid timezone issues
    const datePart = dateString.split('T')[0] // Get "2025-08-03" from "2025-08-03T00:00:00.000Z"
    date = new Date(datePart + 'T12:00:00.000Z') // Use noon UTC to avoid timezone boundary issues
  } else {
    // Just date string (YYYY-MM-DD), parse as UTC
    date = new Date(dateString + 'T12:00:00.000Z')
  }
  
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

export function parseSessionDate(dateString: string): Date {
  // Parse a date string as UTC to avoid timezone issues
  if (dateString.includes('T')) {
    const datePart = dateString.split('T')[0]
    return new Date(datePart + 'T12:00:00.000Z')
  } else {
    return new Date(dateString + 'T12:00:00.000Z')
  }
}

export function formatDateForInput(date: Date): string {
  // Format a date for HTML date input (YYYY-MM-DD)
  return date.toISOString().split('T')[0]
}