"use client"

// Client-side authentication check
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('admin-authenticated') === 'true'
}

export function clearAdminAuth(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin-authenticated')
  }
}

// Hook for checking auth status
export function useAdminAuth() {
  const isAuthenticated = isAdminAuthenticated()
  
  return {
    isAuthenticated,
    logout: () => {
      clearAdminAuth()
      window.location.href = '/admin/login'
    }
  }
}