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
    title: "CodeFest 2025",
    description: "Our annual 48-hour coding marathon with amazing prizes.",
    date: "April 15-17, 2025",
    venue: "Main Campus, Building A",
    image: "https://placehold.co/600x400/4338ca/ffffff?text=CodeFest+2025",
    isExternal: false,
    enrollmentLink: "/enroll/codefest",
  },
  {
    id: "2",
    title: "HackHealth",
    description: "Build innovative solutions for healthcare challenges.",
    date: "May 5-7, 2025",
    venue: "Medical Sciences Building",
    image: "https://placehold.co/600x400/0891b2/ffffff?text=HackHealth",
    isExternal: false,
    enrollmentLink: "/enroll/hackhealth",
  },
  {
    id: "3",
    title: "Global AI Hackathon",
    description: "Join teams from around the world to solve AI challenges.",
    date: "June 10-12, 2025",
    venue: "Virtual Event",
    image: "https://placehold.co/600x400/7c3aed/ffffff?text=Global+AI+Hackathon",
    isExternal: true,
    enrollmentLink: "https://example.com/global-ai-hackathon",
  },
  {
    id: "4",
    title: "Sustainability Hack",
    description: "Create tech solutions for environmental challenges.",
    date: "July 8-10, 2025",
    venue: "Environmental Sciences Center",
    image: "https://placehold.co/600x400/059669/ffffff?text=Sustainability+Hack",
    isExternal: false,
    enrollmentLink: "/enroll/sustainability-hack",
  },
  {
    id: "5",
    title: "Microsoft Imagine Cup",
    description: "The premier global student technology competition.",
    date: "August 20-22, 2025",
    venue: "Microsoft Campus (External)",
    image: "https://placehold.co/600x400/0ea5e9/ffffff?text=Imagine+Cup",
    isExternal: true,
    enrollmentLink: "https://example.com/imagine-cup",
  },
]

const workshopEvents = [
  {
    id: "w1",
    title: "Web Development Bootcamp",
    description: "Learn modern web development with React and Next.js.",
    date: "April 5, 2025",
    venue: "Computer Science Building, Room 101",
    image: "https://placehold.co/600x400/f97316/ffffff?text=Web+Dev+Bootcamp",
    isExternal: false,
    enrollmentLink: "/enroll/web-dev-bootcamp",
  },
  {
    id: "w2",
    title: "Machine Learning Fundamentals",
    description: "Introduction to ML algorithms and practical applications.",
    date: "April 12, 2025",
    venue: "AI Lab, Building B",
    image: "https://placehold.co/600x400/ec4899/ffffff?text=ML+Fundamentals",
    isExternal: false,
    enrollmentLink: "/enroll/ml-fundamentals",
  },
  {
    id: "w3",
    title: "UI/UX Design Workshop",
    description: "Learn design principles and tools for creating great user experiences.",
    date: "April 19, 2025",
    venue: "Design Studio, Arts Building",
    image: "https://placehold.co/600x400/8b5cf6/ffffff?text=UI/UX+Design",
    isExternal: false,
    enrollmentLink: "/enroll/uiux-workshop",
  },
  {
    id: "w4",
    title: "Blockchain Development",
    description: "Build decentralized applications with Ethereum and Solidity.",
    date: "April 26, 2025",
    venue: "Innovation Hub",
    image: "https://placehold.co/600x400/10b981/ffffff?text=Blockchain+Dev",
    isExternal: false,
    enrollmentLink: "/enroll/blockchain-dev",
  },
  {
    id: "w5",
    title: "Cloud Computing with AWS",
    description: "Learn to deploy and scale applications on Amazon Web Services.",
    date: "May 3, 2025",
    venue: "Virtual Workshop",
    image: "https://placehold.co/600x400/6366f1/ffffff?text=AWS+Workshop",
    isExternal: true,
    enrollmentLink: "https://example.com/aws-workshop",
  },
]

const clubsData = [
  {
    id: "c1",
    name: "Coding Club",
    description: "A community of passionate programmers working on exciting projects.",
    memberCount: 120,
    foundedYear: 2018,
    logo: "https://placehold.co/200x200/4338ca/ffffff?text=Coding+Club",
    enrollmentLink: "/clubs/coding",
  },
  {
    id: "c2",
    name: "AI Research Group",
    description: "Exploring cutting-edge AI research and applications.",
    memberCount: 85,
    foundedYear: 2019,
    logo: "https://placehold.co/200x200/7c3aed/ffffff?text=AI+Research",
    enrollmentLink: "/clubs/ai-research",
  },
  {
    id: "c3",
    name: "Robotics Society",
    description: "Building robots and participating in national competitions.",
    memberCount: 65,
    foundedYear: 2015,
    logo: "https://placehold.co/200x200/0891b2/ffffff?text=Robotics",
    enrollmentLink: "/clubs/robotics",
  },
  {
    id: "c4",
    name: "Cybersecurity Team",
    description: "Learning ethical hacking and participating in CTF competitions.",
    memberCount: 50,
    foundedYear: 2020,
    logo: "https://placehold.co/200x200/f97316/ffffff?text=Cybersecurity",
    enrollmentLink: "/clubs/cybersecurity",
  },
  {
    id: "c5",
    name: "Game Development Club",
    description: "Creating games using modern engines and technologies.",
    memberCount: 70,
    foundedYear: 2017,
    logo: "https://placehold.co/200x200/ec4899/ffffff?text=Game+Dev",
    enrollmentLink: "/clubs/game-dev",
  },
  {
    id: "c6",
    name: "Open Source Community",
    description: "Contributing to open source projects and hosting workshops.",
    memberCount: 55,
    foundedYear: 2021,
    logo: "https://placehold.co/200x200/10b981/ffffff?text=Open+Source",
    enrollmentLink: "/clubs/open-source",
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
              <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
                src="https://placehold.co/600x400/6366f1/ffffff?text=Students+Collaborating"
                alt="Students collaborating"
                className="object-cover w-full h-full"
              />
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

