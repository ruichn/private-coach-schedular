/**
 * Utility functions for handling dates consistently across the application
 * Fixes timezone offset issues when displaying dates
 */

export function formatSessionDate(dateString: string): string {
  // Handle both YYYY-MM-DD and full ISO date strings
  let date: Date
  
  if (dateString.includes('T')) {
    // Already has time component (from API)
    date = new Date(dateString)
  } else {
    // Just date string (YYYY-MM-DD), parse as UTC
    date = new Date(dateString + 'T00:00:00.000Z')
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
    // Already has time component (from API)
    date = new Date(dateString)
  } else {
    // Just date string (YYYY-MM-DD), parse as UTC
    date = new Date(dateString + 'T00:00:00.000Z')
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
    return new Date(dateString)
  } else {
    return new Date(dateString + 'T00:00:00.000Z')
  }
}

export function formatDateForInput(date: Date): string {
  // Format a date for HTML date input (YYYY-MM-DD)
  return date.toISOString().split('T')[0]
}