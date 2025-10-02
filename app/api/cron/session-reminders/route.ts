import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSessionReminder } from '@/lib/email'
import { sanitizeLogData } from '@/lib/security'

// This endpoint should be called by a cron job once per day
// It sends reminder emails 24 hours before each session
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job (using a secret token)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('Unauthorized cron job access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get tomorrow's date in Pacific Time (Seattle, WA)
    const now = new Date()
    const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    const year = pacificTime.getFullYear()
    const month = pacificTime.getMonth()
    const day = pacificTime.getDate()

    // Get sessions happening tomorrow (at midnight UTC)
    const tomorrowStart = new Date(Date.UTC(year, month, day + 1, 0, 0, 0, 0))
    const tomorrowEnd = new Date(Date.UTC(year, month, day + 2, 0, 0, 0, 0))

    console.log('Checking for sessions between:', tomorrowStart.toISOString(), 'and', tomorrowEnd.toISOString())

    const sessions = await prisma.session.findMany({
      where: {
        date: {
          gte: tomorrowStart,
          lt: tomorrowEnd,
        },
        isVisible: true,
      },
      include: {
        registrations: true,
      },
    })

    console.log(`Found ${sessions.length} sessions tomorrow`)

    let emailsSent = 0
    let emailsFailed = 0

    // Send reminders for each session
    for (const session of sessions) {
      console.log(`Processing session ${session.id} with ${session.registrations.length} registrations`)

      for (const registration of session.registrations) {
        const result = await sendSessionReminder({
          playerName: registration.playerName,
          parentName: registration.parentName,
          parentEmail: registration.parentEmail,
          sessionDate: session.date.toISOString(),
          sessionTime: session.time,
          sessionLocation: session.location,
          sessionAddress: session.address,
          ageGroup: session.ageGroup,
          sport: session.sport,
          focus: session.focus,
          price: session.price,
        })

        if (result.success) {
          emailsSent++
          console.log(`Reminder sent to ${registration.parentEmail} for session ${session.id}`)
        } else {
          emailsFailed++
          console.error(`Failed to send reminder to ${registration.parentEmail}:`, sanitizeLogData(result.error))
        }
      }
    }

    console.log(`Session reminders completed: ${emailsSent} sent, ${emailsFailed} failed`)

    return NextResponse.json({
      success: true,
      sessionsFound: sessions.length,
      emailsSent,
      emailsFailed,
    })
  } catch (error) {
    console.error('Session reminder cron job error:', sanitizeLogData(error))
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
