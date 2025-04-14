"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Users, Code, BookOpen, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { EventCarousel } from "@/components/event-carousel"
import { ClubCarousel } from "@/components/club-carousel"
import { UILogo } from "@/components/ui-logo"
import { ScrollProgress } from "@/components/scroll-progress"
import { ConfettiButton } from "@/components/confetti-button"
import { AnimatedCard, CardContent, CardHeader, CardTitle } from "@/components/animated-card"
import { EventCalendar } from "@/components/event-calendar"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Event data
const hackathonEvents = [

  {
    id: "1",
    title: "MOZOHACK 6.0",
    description: "Continuing the legacy of our past iterations, we have come back with even more grit, more challenge and most of all more fun. SRMKZILLA invites you to the most anticipated hackathon of the year - MOZOHACK 5.0",
    date: "April 21-22, 2025",
    venue: "DEI Hall, BEL, 5th Floor, SRMIST",
    image: "/mozo.png",
    isExternal: false,
    enrollmentLink: "https://unstop.com/competitions/1462739/register",
  },
  {
    id: "2",
    title: "AI Agents Hackathon 2025",
    description: "FREE three-week virtual hackathon is your chance to dive deep into AI agent development.",
    date: "April 8-30, 2025",
    venue: "Virtual Event (microsoft)",
    image: "/mic.png",
    isExternal: true,
    enrollmentLink: "https://microsoft.github.io/AI_Agents_Hackathon/",
  },
  {
    id: "3",
    title: "CodeKombat: Inter-college DSA Competition",
    description: "Inter-college DSA competition",
    date: "April 16, 2025",
    venue: "Ramanujan College",
    image: "/code.webp",
    isExternal: true,
    enrollmentLink: "https://unstop.com/hackathons/codekombat-inter-college-dsa-competition-educen-ramanujan-college-1462826?rstatus=1",
  },
  {
    id: "4",
    title: "TDX Hackathon",
    description: "Join your fellow participants for a fun kick-off event",
    date: "April 29-30, 2025",
    venue: "Bangalore International Exhibition Centre Hall 1",
    image: "/sales.png",
    isExternal: true,
    enrollmentLink: "https://www.salesforce.com/in/tdx/hackathon/",
  },
  {
    id: "5",
    title: "Query Quest",
    description: "A Database Competition",
    date: "April 21, 2025",
    venue: "UB 1209, 1213",
    image: "/qq.jpeg",
    isExternal: false,
    enrollmentLink: "https://docs.google.com/forms/d/e/1FAIpQLSfEG6ojVugz983BggioQGGJNj2Xa_9zjYfG0TZm27-FqQpaNw/viewform",
  },
  {
    id: "6",
    title: "Hack Gear 1.0",
    description: "A Tech Innovation Hackathon on AI, Blockchain, Cybersecurity & Web.",
    date: "April 30, 2025",
    venue: "Shahpur, Madrak, Near Manglayatan Temple, Aligarh Agra Highway, Approx 10 km from Sasni Gate Aligarh- 202150, Aligarh, Uttar Pradesh, India",
    image: "/hg.webp",
    isExternal: true,
    enrollmentLink: "https://unstop.com/competitions/1461417/register",
  },
 
]

const workshopEvents = [
  {
    id: "w1",
    title: "ML for Sediment Transport Prediction",
    description: "Join this interactive, hands-on workshop to discover how machine learning can be applied to predict sediment transport in river systems—a crucial aspect of river engineering, erosion control, and water resource management.",
    date: "April 18, 2025",
    venue: "Indian Institute of Technology (IIT), Madras",
    image: "/ml.jpg",
    isExternal: true,
    enrollmentLink: "https://unstop.com/workshops-webinars/ml-for-sediment-transport-prediction-cea-fest-2025-iit-madras-1462206",
  },
  {
    id: "w2",
    title: "One-day Training Cum Workshop on atr Ft-ir Spectroscopyand interpretation for Science & Engineering Applications 2025",
    description: "A one-day workshop on FT-IR spectroscopy and its applications.",
    date: "April 15, 2025",
    venue: "Sathyabama Institute of Science and Technology",
    image: "/sath.jpg",
    isExternal: true,
    enrollmentLink: "https://docs.google.com/forms/d/e/1FAIpQLSdurVBQzDepNqPqy0EAFLkNb6rN8a8YFAoiGtsC70Q4KCyGIA/viewform?pli=1",
  },
  {
    id: "w3",
    title: "ICCETSP 2025",
    description: "International Conference",
    date: "April 16th, 2025",
    venue: "SRM Institute of Science and Technology Vadapalani Campus",
    image: "/vada.jpg",
    isExternal: true,
    enrollmentLink: "https://docs.google.com/forms/d/e/1FAIpQLSe7QoHxs9CFGdNOnP83rqUUNBvwWfNyB_ss66q2AxRRRTD8kQ/viewform",
  },
  {
    id: "w4",
    title: "Perspect University Learning Camp-Microsoft AI Skills Fest Edition",
    description: "Build decentralized applications with Ethereum and Solidity.",
    date: "April 17, 2025",
    venue: "Virtual Workshop",
    image: "https://placehold.co/600x400/10b981/ffffff?text=Perspect+University+Learning+Camp",
    isExternal: true,
    enrollmentLink: "https://unstop.com/workshops-webinars/perspect-university-learning-camp-microsoft-ai-skills-fest-edition-perspect-university-1462102",
  },
  {
    id: "w5",
    title: "ETABS Workshop",
    description: "ETABS workshops conducted in institutes focus on training students, engineers, and professionals in using the ETABS software for structural analysis and design.",
    date: "April 19, 2025",
    venue: "Indian Institute of Technology (IIT), Madras",
    image: "/etab.webp",
    isExternal: true,
    enrollmentLink: "https://unstop.com/competitions/1461603/register",
  },
]

const clubsData = [
  {
    id: "c1",
    name: "IoTAlliance",
    description: "IoT Alliance, or IOTA as we are popularly known, are the only AICTE recognised club. We create Innovative Projects and host Tech Events in IoT, AI and Robotics",
    memberCount: 50,
    foundedYear: 2018,
    logo: "iota.jpg",
    enrollmentLink: "https://iotalliancesrm.vercel.app/",
  },
  {
    id: "c2",
    name: "CODENEX",
    description: "Code Nex, founded in 2024 at SRM KTR, focuses on app and web development, blockchain, and AI/ML..",
    memberCount: 85,
    foundedYear: 2024,
    logo: "codenex.png",
    enrollmentLink: "https://www.codenex.co.in/",
  },
  {
    id: "c3",
    name: "SRMKZILLA",
    description: "The campus club you love. We make tech exuberant and open source. We know no limits.",
    memberCount: 65,
    foundedYear: 2015,
    logo: "/kzilla.jpg",
    enrollmentLink: "https://www.srmkzilla.net/",
  },
  {
    id: "c4",
    name: "Cherry+ Network",
    description: "Cherry+ Network, the coolest club on campus, where you discover the secret to success and pave the way for your dreams.",
    memberCount: 50,
    foundedYear: 2020,
    logo: "/cherry.jpg",
    enrollmentLink: "https://cherrynetwork.in/",
  },
  {
    id: "c5",
    name: "Github Community SRM",
    description: "GitHub Community SRM is the official student-led community affiliated with GitHub, spearheading the open-source revolution at SRMIST.",
    memberCount: 70,
    foundedYear: 2017,
    logo: "/githubcom.png",
    enrollmentLink: "https://www.githubsrmist.tech/",
  },
  
  {
    id: "c6",
    name: "Cintel Student Association",
    description: "Cintel Student Association at SRMIST fosters innovation through workshops, hackathons & research, bridging academics & industry while building leadership.",
    memberCount: 55,
    foundedYear: 2021,
    logo: "cintel.jpg",
    enrollmentLink: "https://www.srmist.edu.in/department/department-of-computational-intelligence/cintel-student-association/",
  },
  {
    id: "c7",
    name: "dBug Labs",
    description: "Every bug is just a hidden feature waiting to be discovered",
    memberCount: 55,
    foundedYear: 2021,
    logo: "dbug.jpg",
    enrollmentLink: "https://dbuglabs.vercel.app/",
  },
  {
    id: "c8",
    name: "Quantum Computing Club SRM",
    description: "The SRM Quantum Computing Club is a dynamic student organization at SRM University, united by a passion for quantum computing.",
    memberCount: 55,
    foundedYear: 2021,
    logo: "/qccs.jpg",
    enrollmentLink: "https://www.sqcc.xyz/",
  },

  
]

// Combine all events for the calendar
const allEvents = [...hackathonEvents, ...workshopEvents]

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <UILogo />
            <span className="text-xl font-bold">ClubSphere</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#hackathons"
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              Hackathons
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#workshops" className="text-sm font-medium transition-colors hover:text-primary relative group">
              Workshops
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#clubs" className="text-sm font-medium transition-colors hover:text-primary relative group">
              Clubs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#about" className="text-sm font-medium transition-colors hover:text-primary relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button asChild className="hidden md:inline-flex">
              <Link href="/sign-in">Sign In</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="#hackathons" className="text-lg font-medium">
                    Hackathons
                  </Link>
                  <Link href="#workshops" className="text-lg font-medium">
                    Workshops
                  </Link>
                  <Link href="#clubs" className="text-lg font-medium">
                    Clubs
                  </Link>
                  <Link href="#about" className="text-lg font-medium">
                    About
                  </Link>
                  <Button asChild className="mt-4">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Discover Tech Events & Communities
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Your one-stop platform for hackathons, workshops, and tech clubs at our college and beyond.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <EventCalendar events={allEvents}>
                <Button size="lg" className="group">
                  <Calendar className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Explore Events
                </Button>
              </EventCalendar>

              <Button
                size="lg"
                variant="outline"
                className="group"
                onClick={() => {
                  document.getElementById("clubs")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <Users className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Join a Club
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hackathons Section */}
      <section id="hackathons" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Upcoming Hackathons</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Discover exciting hackathons happening on campus and around the world.
              </p>
            </motion.div>
            <div className="w-full">
              <EventCarousel events={hackathonEvents} />
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <section id="workshops" className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Upcoming Workshops</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Enhance your skills with hands-on workshops led by industry experts.
              </p>
            </motion.div>
            <div className="w-full">
              <EventCarousel events={workshopEvents} />
            </div>
          </div>
        </div>
      </section>

      {/* Clubs Section */}
      <section id="clubs" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Tech Clubs</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Join student-led communities to collaborate, learn, and grow together.
              </p>
            </motion.div>
            <div className="w-full">
              <ClubCarousel clubs={clubsData} />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">About ClubSphere</h2>
              <p className="text-muted-foreground md:text-xl">
                ClubSphere is the central hub for all technology-related activities at our college. We aim to foster
                innovation, collaboration, and learning through various events and communities.
              </p>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Promoting tech education and skill development</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Building a vibrant tech community</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <span>Supporting student-led initiatives</span>
                </li>
              </ul>
              <Button size="lg" className="mt-4 group">
                Learn More
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 z-10 rounded-xl" />
              <div className="w-full h-full flex items-center justify-center">
   <motion.div
    initial={{ scale: 1.1 }}
    whileInView={{ scale: 5 }}
    transition={{ duration: 1.5 }}
    viewport={{ once: true }}
  >
    <UILogo />
  </motion.div>
</div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Why Choose ClubSphere?</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              We provide everything you need to make the most of your college tech experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedCard delay={0.1}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Event Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find and filter events based on your interests, skills, and availability.
                </p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community Building
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with like-minded students and build your professional network.
                </p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Skill Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn new technologies and enhance your skills through workshops and hackathons.
                </p>
              </CardContent>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Stay Updated</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Subscribe to our newsletter to get the latest updates on events, workshops, and opportunities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full max-w-sm space-y-2"
            >
              <form className="flex space-x-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <ConfettiButton href="#" className="group">
                  Subscribe
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="ml-2"
                  >
                  </motion.span>
                </ConfettiButton>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <UILogo />
            <span className="font-semibold">ClubSphere</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} ClubSphere. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Developed by{" "}
            <a href="https://github.com/KaveenKrithik" className="text-primary hover:underline font-medium">
              Kaveen
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
  
}



