import nodemailer from 'nodemailer'
import { createCalendarEvent, generateICS } from '@/lib/calendar-utils'

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password for Gmail
  },
})

interface RegistrationEmailData {
  sessionId: number
  playerName: string
  parentName: string
  parentEmail: string
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

interface SessionUpdateEmailData {
  sessionId: number
  playerName: string
  parentName: string
  parentEmail: string
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
  changes: string[]
}

export async function sendRegistrationConfirmation(data: RegistrationEmailData) {
  const {
    sessionId,
    playerName,
    parentName,
    parentEmail,
    sessionDate,
    sessionTime,
    sessionLocation,
    sessionAddress,
    ageGroup,
    sport,
    focus,
    price,
    cancellationToken,
    cancellationUrl,
  } = data

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Generate calendar event
  const calendarEvent = createCalendarEvent({
    id: sessionId,
    sport,
    ageGroup,
    date: sessionDate,
    time: sessionTime,
    location: sessionLocation,
    focus,
    price
  })

  // Generate ICS file content
  const icsContent = generateICS(calendarEvent)
  const icsFilename = `${sport}_training_${ageGroup}_${sessionDate.replace(/[-:]/g, '')}.ics`

  const subject = `Registration Confirmed: ${playerName} - ${sport.charAt(0).toUpperCase() + sport.slice(1)} Training Session`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Registration Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .session-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .important-info { background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .cancellation-notice { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
        h2 { color: #1f2937; margin-top: 0; }
        .detail-row { margin: 8px 0; }
        .label { font-weight: bold; color: #374151; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${sport === 'volleyball' ? '🏐' : '🏀'} Registration Confirmed!</h1>
        <p>Coach Robe Sports Training</p>
      </div>
      
      <div class="content">
        <h2>Hi ${parentName},</h2>
        
        <p>Thank you for registering <strong>${playerName}</strong> for the ${sport} training session! We're excited to have them join us.</p>
        
        <div class="session-details">
          <h3>📅 Session Details</h3>
          <div class="detail-row"><span class="label">Player:</span> ${playerName}</div>
          <div class="detail-row"><span class="label">Session:</span> ${sport.charAt(0).toUpperCase() + sport.slice(1)} - ${ageGroup}</div>
          <div class="detail-row"><span class="label">Focus:</span> ${focus}</div>
          <div class="detail-row"><span class="label">Date:</span> ${formatDate(sessionDate)}</div>
          <div class="detail-row"><span class="label">Time:</span> ${sessionTime}</div>
          <div class="detail-row"><span class="label">Location:</span> ${sessionLocation}</div>
          <div class="detail-row"><span class="label">Address:</span> ${sessionAddress}</div>
          ${price > 0 ? `<div class="detail-row"><span class="label">Session Fee:</span> $${price}</div>` : ''}
        </div>
        
        <div class="important-info">
          <h3>📋 Important Information</h3>
          <ul>
            <li><strong>Arrival:</strong> Please arrive 10-15 minutes before the session starts</li>
            ${price > 0 ? '<li><strong>Payment:</strong> Session fee will be collected at the training session (cash, Venmo, or Zelle)</li>' : ''}
            <li><strong>What to bring:</strong> Water bottle, comfortable athletic wear, and court shoes</li>
            <li><strong>Contact:</strong> Coach Robe will be available 15 minutes before the session for any questions</li>
            <li><strong>📅 Calendar:</strong> A calendar event file (${icsFilename}) is attached to this email - simply open it to add the session to your calendar</li>
          </ul>
        </div>
        
        <div class="cancellation-notice">
          <h3>⚠️ Cancellation Policy</h3>
          <p>If you need to cancel this registration, please use the cancellation link below. <strong>Cancellations must be made at least 24 hours before the training session.</strong></p>
          
          <p style="text-align: center;">
            <a href="${cancellationUrl}" class="button">Cancel Registration</a>
          </p>
          
          <p style="font-size: 12px; color: #6b7280;">
            This cancellation link will expire 24 hours before the session starts and can only be used once.
          </p>
        </div>
        
        <p>If you have any questions or concerns, please don't hesitate to contact us at <a href="mailto:Robe@PodioSports.org">Robe@PodioSports.org</a>.</p>
        
        <p>We look forward to seeing ${playerName} at the training session!</p>
        
        <p>Best regards,<br>
        <strong>Coach Robe</strong><br>
        Podio Sports Training</p>
      </div>
      
      <div class="footer">
        <p>This is an automated confirmation email for your ${sport} training registration.</p>
        <p>Podio Sports | <a href="mailto:Robe@PodioSports.org">Robe@PodioSports.org</a></p>
      </div>
    </body>
    </html>
  `

  const textContent = `
Registration Confirmed: ${playerName} - ${sport.charAt(0).toUpperCase() + sport.slice(1)} Training Session

Hi ${parentName},

Thank you for registering ${playerName} for the ${sport} training session!

SESSION DETAILS:
Player: ${playerName}
Session: ${sport.charAt(0).toUpperCase() + sport.slice(1)} - ${ageGroup}
Focus: ${focus}
Date: ${formatDate(sessionDate)}
Time: ${sessionTime}
Location: ${sessionLocation}
Address: ${sessionAddress}
${price > 0 ? `Session Fee: $${price}` : ''}

IMPORTANT INFORMATION:
- Please arrive 10-15 minutes before the session starts
${price > 0 ? '- Payment will be collected at the session (cash, Venmo, or Zelle)' : ''}
- Bring: Water bottle, athletic wear, and court shoes
- Coach Robe will be available 15 minutes early for questions
- Calendar: A calendar event file (${icsFilename}) is attached - open it to add the session to your calendar

CANCELLATION POLICY:
Cancellations must be made at least 24 hours before the training session.
To cancel, visit: ${cancellationUrl}

This cancellation link expires 24 hours before the session and can only be used once.

If you have any questions, contact us at Robe@PodioSports.org

Best regards,
Coach Robe
Podio Sports Training
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: parentEmail,
      subject,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: icsFilename,
          content: icsContent,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        },
      ],
    })

    console.log(`Registration confirmation email sent to ${parentEmail} with calendar attachment`)
    return { success: true }
  } catch (error) {
    console.error('Failed to send registration confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendSessionUpdateNotification(data: SessionUpdateEmailData) {
  const {
    sessionId,
    playerName,
    parentName,
    parentEmail,
    sessionDate,
    sessionTime,
    sessionLocation,
    sessionAddress,
    ageGroup,
    sport,
    focus,
    price,
    cancellationToken,
    cancellationUrl,
    changes,
  } = data

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Generate calendar event
  const calendarEvent = createCalendarEvent({
    id: sessionId,
    sport,
    ageGroup,
    date: sessionDate,
    time: sessionTime,
    location: sessionLocation,
    focus,
    price
  })

  // Generate ICS file content
  const icsContent = generateICS(calendarEvent)
  const icsFilename = `${sport}_training_${ageGroup}_${sessionDate.replace(/[-:]/g, '')}_updated.ics`

  const subject = `Session Update: ${playerName} - ${sport.charAt(0).toUpperCase() + sport.slice(1)} Training Session`

  const changesList = changes.map(change => `<li>${change}</li>`).join('')
  const changesText = changes.map(change => `- ${change}`).join('\n')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Session Update Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .session-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .changes-section { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .important-info { background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .cancellation-notice { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
        h2 { color: #1f2937; margin-top: 0; }
        .detail-row { margin: 8px 0; }
        .label { font-weight: bold; color: #374151; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⚠️ Session Update Notification</h1>
        <p>Coach Robe Sports Training</p>
      </div>
      
      <div class="content">
        <h2>Hi ${parentName},</h2>
        
        <p>We wanted to notify you that there have been updates to <strong>${playerName}</strong>'s upcoming ${sport} training session.</p>
        
        <div class="changes-section">
          <h3>📝 What Changed:</h3>
          <ul>
            ${changesList}
          </ul>
        </div>
        
        <div class="session-details">
          <h3>📅 Updated Session Details</h3>
          <div class="detail-row"><span class="label">Player:</span> ${playerName}</div>
          <div class="detail-row"><span class="label">Session:</span> ${sport.charAt(0).toUpperCase() + sport.slice(1)} - ${ageGroup}</div>
          <div class="detail-row"><span class="label">Focus:</span> ${focus}</div>
          <div class="detail-row"><span class="label">Date:</span> ${formatDate(sessionDate)}</div>
          <div class="detail-row"><span class="label">Time:</span> ${sessionTime}</div>
          <div class="detail-row"><span class="label">Location:</span> ${sessionLocation}</div>
          <div class="detail-row"><span class="label">Address:</span> ${sessionAddress}</div>
          ${price > 0 ? `<div class="detail-row"><span class="label">Session Fee:</span> $${price}</div>` : ''}
        </div>
        
        <div class="important-info">
          <h3>📋 Important Information</h3>
          <ul>
            <li><strong>Arrival:</strong> Please arrive 10-15 minutes before the session starts</li>
            ${price > 0 ? '<li><strong>Payment:</strong> Session fee will be collected at the training session (cash, Venmo, or Zelle)</li>' : ''}
            <li><strong>What to bring:</strong> Water bottle, comfortable athletic wear, and court shoes</li>
            <li><strong>Contact:</strong> Coach Robe will be available 15 minutes before the session for any questions</li>
            <li><strong>📅 Calendar:</strong> An updated calendar event file (${icsFilename}) is attached to this email - replace your previous calendar entry</li>
          </ul>
        </div>
        
        <div class="cancellation-notice">
          <h3>⚠️ Need to Cancel?</h3>
          <p>If these changes don't work for you and you need to cancel this registration, please use the cancellation link below. <strong>Cancellations must be made at least 24 hours before the training session.</strong></p>
          
          <p style="text-align: center;">
            <a href="${cancellationUrl}" class="button">Cancel Registration</a>
          </p>
          
          <p style="font-size: 12px; color: #6b7280;">
            This cancellation link will expire 24 hours before the session starts and can only be used once.
          </p>
        </div>
        
        <p>If you have any questions or concerns about these changes, please don't hesitate to contact us at <a href="mailto:Robe@PodioSports.org">Robe@PodioSports.org</a>.</p>
        
        <p>We look forward to seeing ${playerName} at the updated training session!</p>
        
        <p>Best regards,<br>
        <strong>Coach Robe</strong><br>
        Podio Sports Training</p>
      </div>
      
      <div class="footer">
        <p>This is an automated update notification for your ${sport} training registration.</p>
        <p>Podio Sports | <a href="mailto:Robe@PodioSports.org">Robe@PodioSports.org</a></p>
      </div>
    </body>
    </html>
  `

  const textContent = `
Session Update: ${playerName} - ${sport.charAt(0).toUpperCase() + sport.slice(1)} Training Session

Hi ${parentName},

We wanted to notify you that there have been updates to ${playerName}'s upcoming ${sport} training session.

WHAT CHANGED:
${changesText}

UPDATED SESSION DETAILS:
Player: ${playerName}
Session: ${sport.charAt(0).toUpperCase() + sport.slice(1)} - ${ageGroup}
Focus: ${focus}
Date: ${formatDate(sessionDate)}
Time: ${sessionTime}
Location: ${sessionLocation}
Address: ${sessionAddress}
${price > 0 ? `Session Fee: $${price}` : ''}

IMPORTANT INFORMATION:
- Please arrive 10-15 minutes before the session starts
${price > 0 ? '- Payment will be collected at the session (cash, Venmo, or Zelle)' : ''}
- Bring: Water bottle, athletic wear, and court shoes
- Coach Robe will be available 15 minutes early for questions
- Calendar: An updated calendar event file (${icsFilename}) is attached - replace your previous calendar entry

NEED TO CANCEL?
If these changes don't work for you, cancellations must be made at least 24 hours before the training session.
To cancel, visit: ${cancellationUrl}

This cancellation link expires 24 hours before the session and can only be used once.

If you have any questions about these changes, contact us at Robe@PodioSports.org

Best regards,
Coach Robe
Podio Sports Training
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: parentEmail,
      subject,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: icsFilename,
          content: icsContent,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        },
      ],
    })

    console.log(`Session update notification sent to ${parentEmail} with updated calendar attachment`)
    return { success: true }
  } catch (error) {
    console.error('Failed to send session update notification:', error)
    return { success: false, error }
  }
}

export async function sendSessionUpdateToAllPlayers(
  sessionId: number,
  oldSessionData: any,
  newSessionData: any
) {
  try {
    // Import prisma here to avoid circular dependencies
    const { prisma } = await import('@/lib/prisma')
    
    // Get all registrations for this session
    const registrations = await prisma.registration.findMany({
      where: { sessionId },
      include: {
        session: true
      }
    })

    if (registrations.length === 0) {
      console.log(`No registrations found for session ${sessionId}`)
      return { success: true, emailsSent: 0 }
    }

    // Determine what changed
    const changes: string[] = []
    
    if (oldSessionData.date !== newSessionData.date) {
      const oldDate = new Date(oldSessionData.date).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      })
      const newDate = new Date(newSessionData.date).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      })
      changes.push(`Date changed from ${oldDate} to ${newDate}`)
    }
    
    if (oldSessionData.time !== newSessionData.time) {
      changes.push(`Time changed from ${oldSessionData.time} to ${newSessionData.time}`)
    }
    
    if (oldSessionData.location !== newSessionData.location) {
      changes.push(`Location changed from ${oldSessionData.location} to ${newSessionData.location}`)
    }
    
    if (oldSessionData.address !== newSessionData.address) {
      changes.push(`Address changed from ${oldSessionData.address} to ${newSessionData.address}`)
    }
    
    if (oldSessionData.focus !== newSessionData.focus) {
      changes.push(`Focus changed from "${oldSessionData.focus}" to "${newSessionData.focus}"`)
    }
    
    if (oldSessionData.price !== newSessionData.price) {
      changes.push(`Price changed from $${oldSessionData.price} to $${newSessionData.price}`)
    }

    if (changes.length === 0) {
      console.log(`No significant changes detected for session ${sessionId}`)
      return { success: true, emailsSent: 0 }
    }

    console.log(`Sending update emails to ${registrations.length} registered players for session ${sessionId}`)
    console.log('Changes detected:', changes)

    let emailsSent = 0
    let emailsFailed = 0

    // Send update email to each registered player
    for (const registration of registrations) {
      try {
        const cancellationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel/${registration.cancellationToken}`
        
        await sendSessionUpdateNotification({
          sessionId,
          playerName: registration.playerName,
          parentName: registration.parentName,
          parentEmail: registration.parentEmail,
          sessionDate: newSessionData.date,
          sessionTime: newSessionData.time,
          sessionLocation: newSessionData.location,
          sessionAddress: newSessionData.address,
          ageGroup: newSessionData.ageGroup,
          sport: newSessionData.sport || 'volleyball',
          focus: newSessionData.focus,
          price: newSessionData.price,
          cancellationToken: registration.cancellationToken,
          cancellationUrl,
          changes
        })
        
        emailsSent++
        console.log(`Update email sent to ${registration.parentEmail} for player ${registration.playerName}`)
      } catch (emailError) {
        emailsFailed++
        console.error(`Failed to send update email to ${registration.parentEmail}:`, emailError)
      }
    }

    console.log(`Session update emails completed: ${emailsSent} sent, ${emailsFailed} failed`)
    return { 
      success: true, 
      emailsSent, 
      emailsFailed,
      changes 
    }
  } catch (error) {
    console.error('Failed to send session update emails:', error)
    return { success: false, error }
  }
}