import nodemailer from 'nodemailer'

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password for Gmail
  },
})

interface RegistrationEmailData {
  playerName: string
  parentName: string
  parentEmail: string
  sessionDate: string
  sessionTime: string
  sessionLocation: string
  sessionAddress: string
  ageGroup: string
  subgroup: string
  focus: string
  price: number
  cancellationToken: string
  cancellationUrl: string
}

export async function sendRegistrationConfirmation(data: RegistrationEmailData) {
  const {
    playerName,
    parentName,
    parentEmail,
    sessionDate,
    sessionTime,
    sessionLocation,
    sessionAddress,
    ageGroup,
    subgroup,
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

  const subject = `Registration Confirmed: ${playerName} - Volleyball Training Session`

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
        <h1>🏐 Registration Confirmed!</h1>
        <p>Coach Robe Volleyball Training</p>
      </div>
      
      <div class="content">
        <h2>Hi ${parentName},</h2>
        
        <p>Thank you for registering <strong>${playerName}</strong> for the volleyball training session! We're excited to have them join us.</p>
        
        <div class="session-details">
          <h3>📅 Session Details</h3>
          <div class="detail-row"><span class="label">Player:</span> ${playerName}</div>
          <div class="detail-row"><span class="label">Session:</span> ${ageGroup} - ${subgroup}</div>
          <div class="detail-row"><span class="label">Focus:</span> ${focus}</div>
          <div class="detail-row"><span class="label">Date:</span> ${formatDate(sessionDate)}</div>
          <div class="detail-row"><span class="label">Time:</span> ${sessionTime}</div>
          <div class="detail-row"><span class="label">Location:</span> ${sessionLocation}</div>
          <div class="detail-row"><span class="label">Address:</span> ${sessionAddress}</div>
          <div class="detail-row"><span class="label">Session Fee:</span> $${price}</div>
        </div>
        
        <div class="important-info">
          <h3>📋 Important Information</h3>
          <ul>
            <li><strong>Arrival:</strong> Please arrive 10-15 minutes before the session starts</li>
            <li><strong>Payment:</strong> Session fee will be collected at the training session (cash, Venmo, or Zelle)</li>
            <li><strong>What to bring:</strong> Water bottle, comfortable athletic wear, and court shoes</li>
            <li><strong>Contact:</strong> Coach Robe will be available 15 minutes before the session for any questions</li>
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
        Podio Sports Volleyball Training</p>
      </div>
      
      <div class="footer">
        <p>This is an automated confirmation email for your volleyball training registration.</p>
        <p>Podio Sports | <a href="mailto:Robe@PodioSports.org">Robe@PodioSports.org</a></p>
      </div>
    </body>
    </html>
  `

  const textContent = `
Registration Confirmed: ${playerName} - Volleyball Training Session

Hi ${parentName},

Thank you for registering ${playerName} for the volleyball training session!

SESSION DETAILS:
Player: ${playerName}
Session: ${ageGroup} - ${subgroup}
Focus: ${focus}
Date: ${formatDate(sessionDate)}
Time: ${sessionTime}
Location: ${sessionLocation}
Address: ${sessionAddress}
Session Fee: $${price}

IMPORTANT INFORMATION:
- Please arrive 10-15 minutes before the session starts
- Payment will be collected at the session (cash, Venmo, or Zelle)
- Bring: Water bottle, athletic wear, and court shoes
- Coach Robe will be available 15 minutes early for questions

CANCELLATION POLICY:
Cancellations must be made at least 24 hours before the training session.
To cancel, visit: ${cancellationUrl}

This cancellation link expires 24 hours before the session and can only be used once.

If you have any questions, contact us at Robe@PodioSports.org

Best regards,
Coach Robe
Podio Sports Volleyball Training
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: parentEmail,
      subject,
      text: textContent,
      html: htmlContent,
    })

    console.log(`Registration confirmation email sent to ${parentEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to send registration confirmation email:', error)
    return { success: false, error }
  }
}