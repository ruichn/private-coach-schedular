import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

// Check if AWS SNS is configured
const isAWSSNSConfigured = !!(
  process.env.AWS_ACCESS_KEY_ID && 
  process.env.AWS_SECRET_ACCESS_KEY && 
  process.env.AWS_REGION
)

export const snsClient = isAWSSNSConfigured 
  ? new SNSClient({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  : null

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Add +1 if it's a 10-digit US number
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  }
  
  // Add + if it doesn't have one but has country code
  if (cleaned.length > 10 && !phone.startsWith('+')) {
    return `+${cleaned}`
  }
  
  // Return as-is if already formatted
  return phone.startsWith('+') ? phone : `+${cleaned}`
}

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  // Accept 10-digit US numbers or 11-digit with country code
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'))
}

export const sendSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
  if (!snsClient) {
    console.log('AWS SNS not configured, simulating SMS send')
    console.log('=== SMS SIMULATION ===')
    console.log('To:', formatPhoneNumber(phoneNumber))
    console.log('Message:')
    console.log(message)
    console.log('=====================')
    return true // Return true for simulation
  }

  try {
    const formattedPhone = formatPhoneNumber(phoneNumber)
    
    const command = new PublishCommand({
      PhoneNumber: formattedPhone,
      Message: message,
    })

    const result = await snsClient.send(command)
    console.log('SMS sent successfully via AWS SNS:', result.MessageId)
    return true

  } catch (error) {
    console.error('AWS SNS SMS sending error:', error)
    return false
  }
}