import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const coach = await prisma.coach.create({
    data: {
      name: "Coach Robe",
      title: "Professional Volleyball Coach",
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.9,
      reviewCount: 127,
      specialties: "Youth Development,Skill Progression,Team Building,Competition Prep,Mental Training",
      minGroupSize: 4,
      maxGroupSize: 12,
      sessionLength: 60,
      hourlyRate: 85,
      location: "Redmond, WA",
      virtualAvailable: false,
      bio: "With over 15 years of experience coaching youth volleyball, Coach Robe has developed hundreds of players from beginner to elite levels. Currently coaching at The Overlake School in Redmond, WA, he specializes in age-appropriate training methods and focuses on building strong fundamentals while developing each player's unique strengths. His programs have produced numerous scholarship athletes and championship teams.",
      experience: {
        create: [
          {
            title: "Head Volleyball Coach",
            company: "Elite Volleyball Academy",
            period: "2015 - Present",
          },
          {
            title: "Assistant Volleyball Coach",
            company: "Premier Volleyball Club",
            period: "2012 - 2015",
          },
          {
            title: "Volleyball Camp Instructor",
            company: "Summer Sports Camps",
            period: "2010 - 2012",
          },
        ],
      },
      certifications: {
        create: [
          { name: "USA Volleyball Certified Coach" },
          { name: "Youth Sports Safety Certified" },
          { name: "First Aid/CPR Certified" },
          { name: "Positive Coaching Alliance Certified" },
        ],
      },
      reviews: {
        create: [
          {
            name: "Jennifer L.",
            rating: 5,
            date: "June 15, 2023",
            comment: "Coach Robe is an amazing volleyball coach! My daughter has improved so much under his guidance.",
          },
          {
            name: "Michael T.",
            rating: 5,
            date: "May 3, 2023",
            comment:
              "Our volleyball team hired Coach Robe for a 6-week training program. His expertise and enthusiasm pushed us to new levels.",
          },
          {
            name: "Sophia R.",
            rating: 4,
            date: "April 22, 2023",
            comment:
              "Coach Robe led a wonderful volleyball clinic for our group of friends. He created a perfect balance of challenging drills and fun games.",
          },
        ],
      },
      availability: {
        create: [
          { day: "monday", times: "6:00 PM - 8:00 PM" },
          { day: "tuesday", times: "6:00 PM - 8:00 PM" },
          { day: "wednesday", times: "6:00 PM - 8:00 PM" },
          { day: "thursday", times: "6:00 PM - 8:00 PM" },
          { day: "friday", times: "" },
          { day: "saturday", times: "9:00 AM - 12:00 PM" },
          { day: "sunday", times: "1:00 PM - 4:00 PM" },
        ],
      },
      ageGroups: {
        create: [
            {
                name: "10 and Under",
                description: "Introduction to volleyball fundamentals for players aged 10 and under.",
                focus: "Basic skills,Fun games,Teamwork",
            },
            {
                name: "12 and Under",
                description: "Intermediate volleyball training for players aged 11-12.",
                focus: "Skill development,Game strategy,Competition",
            },
            {
                name: "14 and Under",
                description: "Advanced volleyball training for players aged 13-14.",
                focus: "Advanced techniques,Position specialization,Tournament preparation",
            },
        ]
      }
    },
  })
  console.log({ coach })

  // Create sessions with current dates
  const session1 = await prisma.session.create({
    data: {
      coachId: coach.id,
      ageGroup: "U14",
      subgroup: "Advanced",
      date: new Date("2025-07-29"),
      time: "18:00 - 20:00",
      location: "The Overlake School Gym",
      address: "20301 NE 108th St, Redmond, WA 98053",
      maxParticipants: 8,
      currentParticipants: 0,
      price: 50,
      focus: "Tryout",
      status: "open",
    },
  })

  const session2 = await prisma.session.create({
    data: {
      coachId: coach.id,
      ageGroup: "U14",
      subgroup: "Intermediate",
      date: new Date("2025-08-01"),
      time: "3:00 PM - 4:30 PM",
      location: "The Overlake School Gym", 
      address: "20301 NE 108th St, Redmond, WA 98053",
      maxParticipants: 15,
      currentParticipants: 0,
      price: 50,
      focus: "Skill Development & Drills",
      status: "open",
    },
  })

  const session3 = await prisma.session.create({
    data: {
      coachId: coach.id,
      ageGroup: "U13",
      subgroup: "Intermediate",
      date: new Date("2025-08-03"),
      time: "9:00 AM - 10:30 AM",
      location: "The Overlake School Gym",
      address: "20301 NE 108th St, Redmond, WA 98053",
      maxParticipants: 6,
      currentParticipants: 0,
      price: 50,
      focus: "Skill Development & Drills",
      status: "open",
    },
  })

  console.log({ session1, session2, session3 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
