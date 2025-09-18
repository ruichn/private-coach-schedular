// import { sendSMS } from './aws-sns' // Disabled for now
import { sanitizeLogData } from './security'

interface SMSData {
  playerName: string
  parentName: string
  parentPhone: string
  sessionDate: string
  sessionTime: string
  sessionLocation: string
  sessionAddress: string
  ageGroup: string
  sport: string
  focus: string
  price: number
  cancellationToken: string
  cancellationUrl: string
}

export async function sendRegistrationSMS(data: SMSData): Promise<boolean> {
  try {
    // SMS temporarily disabled - registration will still work
    console.log(`SMS disabled: Would have sent registration confirmation to ${data.parentPhone} for ${data.playerName}`)
    return false

  } catch (error) {
    console.error('SMS sending error:', sanitizeLogData(error))
    return false
  }
}

export async function sendSessionReminder(data: {
  playerName: string
  parentPhone: string
  sessionTime: string
  sessionLocation: string
  sport: string
  ageGroup: string
  hoursUntil: number
}): Promise<boolean> {
  try {
    // SMS temporarily disabled
    console.log(`SMS disabled: Would have sent session reminder to ${data.parentPhone} for ${data.playerName}`)
    return false

  } catch (error) {
    console.error('Reminder SMS error:', sanitizeLogData(error))
    return false
  }
}

export async function sendCancellationSMS(data: {
  playerName: string
  parentPhone: string
  sessionDate: string
  sessionTime: string
  sport: string
}): Promise<boolean> {
  try {
    // SMS temporarily disabled
    console.log(`SMS disabled: Would have sent cancellation confirmation to ${data.parentPhone} for ${data.playerName}`)
    return false

  } catch (error) {
    console.error('Cancellation SMS error:', sanitizeLogData(error))
    return false
  }
}