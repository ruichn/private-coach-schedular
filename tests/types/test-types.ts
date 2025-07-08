// Test data types and interfaces
export interface TestSession {
  id: number
  ageGroup: string
  subgroup: string
  date: string
  time: string
  location: string
  address: string
  maxParticipants: number
  currentParticipants: number
  price: number
  focus: string
  status: "open" | "full" | "cancelled"
}

export interface TestParticipant {
  id: number
  sessionId: number
  playerName: string
  playerAge: number
  parentName: string
  parentEmail: string
  parentPhone: string
  emergencyContact: string
  emergencyPhone: string
  medicalInfo?: string
  experience?: string
  specialNotes?: string
  registrationDate: string
}

export interface TestUser {
  id: number
  email: string
  role: "coach" | "parent"
  name: string
}

export interface TestFormData {
  playerName: string
  playerAge: string
  parentName: string
  parentEmail: string
  parentPhone: string
  emergencyContact: string
  emergencyPhone: string
  medicalInfo: string
  experience: string
  specialNotes: string
}
