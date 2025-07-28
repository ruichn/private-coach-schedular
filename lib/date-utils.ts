/**
 * Utility functions for handling dates consistently across the application
 * Fixes timezone offset issues when displaying dates
 */

export function formatSessionDate(dateString: string): string {
  // Parse the date string as UTC and format for display
  const date = new Date(dateString + 'T00:00:00.000Z')
  
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatSessionDateShort(dateString: string): string {
  // Parse the date string as UTC and format for display (shorter version)
  const date = new Date(dateString + 'T00:00:00.000Z')
  
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

export function parseSessionDate(dateString: string): Date {
  // Parse a date string as UTC to avoid timezone issues
  return new Date(dateString + 'T00:00:00.000Z')
}

export function formatDateForInput(date: Date): string {
  // Format a date for HTML date input (YYYY-MM-DD)
  return date.toISOString().split('T')[0]
}