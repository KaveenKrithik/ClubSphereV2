"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Users, Code, BookOpen, Menu, User as UserIcon, Search, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { EventCarousel } from "@/components/event-carousel"
import { ClubCarousel } from "@/components/club-carousel"
import { UILogo } from "@/components/ui-logo"
import { ScrollProgress } from "@/components/scroll-progress"
import { ConfettiButton } from "@/components/confetti-button"
import { AnimatedCard, CardContent, CardHeader, CardTitle } from "@/components/animated-card"
import { EventCalendar } from "@/components/event-calendar"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { SignInPrompt } from "@/components/sign-in-prompt"
import { toast } from "sonner"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { AboutModal } from "@/components/about-modal"
import { CommandMenu } from "@/components/command-menu"
import { PathfinderModal } from "@/components/pathfinder-modal"

// Clubs data remains static as requested
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
  {
    id: "c9",
    name: "SRM ACM SIGAI",
    description: "We're a student-led chapter fostering an active AI community. oin us to explore, innovate, and share in advancing AI through events, projects, and collaborations that offer valuable learning and growth opportunities.",
    memberCount: 55,
    foundedYear: 2021,
    logo: "/acm.jpg",
    enrollmentLink: "https://srm-acm-sigai.vercel.app/",
  },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [hackathonEvents, setHackathonEvents] = useState<any[]>([])
  const [workshopEvents, setWorkshopEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading, signOut } = useAuth()
  const [hackathonSearch, setHackathonSearch] = useState("")
  const [workshopSearch, setWorkshopSearch] = useState("")
  const [showPathfinder, setShowPathfinder] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowPathfinder(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    setMounted(true)
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        setHackathonEvents(data.hackathons)
        setWorkshopEvents(data.workshops)
      } catch (err) {
        console.error('Failed to fetch events:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (!mounted) return null

  const filteredHackathons = hackathonEvents.filter(event => 
    event.title.toLowerCase().includes(hackathonSearch.toLowerCase()) ||
    event.description.toLowerCase().includes(hackathonSearch.toLowerCase())
  )

  const filteredWorkshops = workshopEvents.filter(event => 
    event.title.toLowerCase().includes(workshopSearch.toLowerCase()) ||
    event.description.toLowerCase().includes(workshopSearch.toLowerCase())
  )

  const allEvents = [...hackathonEvents, ...workshopEvents]

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSubscriptionStatus("success")
        toast.success(data.message || "Successfully subscribed!")
        setEmail("")
      } else {
        toast.error(data.error || "Something went wrong")
      }
    } catch (err) {
      toast.error("Failed to connect to the server")
    } finally {
      setSubmitting(false)
    }
  }

  const LoadingThrobber = () => (
    <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <UILogo />
      </motion.div>
      <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">Fetching latest events...</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
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
            <CommandMenu />
            <ModeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" className="hidden md:inline-flex gap-2">
                  <Link href="/profile">
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button onClick={() => signOut()} variant="ghost" className="hidden md:inline-flex">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild className="hidden md:inline-flex">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}

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
                  {user ? (
                    <>
                      <Button asChild variant="outline" className="mt-4 gap-2">
                        <Link href="/profile">
                          <UserIcon className="h-4 w-4" />
                          My Profile
                        </Link>
                      </Button>
                      <Button onClick={() => signOut()} variant="ghost" className="mt-2">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button asChild className="mt-4">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                  )}
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
              className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto"
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

      {/* Hype Radar */}
      <section className="container px-4 md:px-6 py-24 border-t border-primary/5">
        <div className="flex flex-col items-center text-center space-y-3 mb-20">
          <h2 className="text-5xl font-black tracking-tighter italic">Trending</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-xs uppercase tracking-[0.2em] font-bold opacity-60">
            Real-time campus momentum
          </p>
        </div>
        
        <div className="w-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-12">
              {[...allEvents.filter(e => e.isInternal), ...allEvents.filter(e => !e.isInternal)].slice(0, 10).map((event, i) => (
                <CarouselItem key={event.id || i} className="pl-4 md:pl-12 md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <Link href={event.enrollmentLink} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-2xl transition-all group-hover:border-primary/30">
                        <img 
                          src={event.image || "/placeholder.svg"} 
                          alt={event.title}
                          className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100 image-render-high-quality"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8 text-left space-y-2">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary block opacity-80">{event.venue}</span>
                          <h3 className="text-2xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">{event.title}</h3>
                          <div className="flex items-center gap-2 pt-2">
                            <div className="h-px w-8 bg-primary/30" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Register Now</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-12">
               <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full border-primary/10 hover:bg-primary/5" />
               <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full border-primary/10 hover:bg-primary/5" />
            </div>
          </Carousel>

          {allEvents.filter(e => e.isInternal).length === 0 && (
             <div className="col-span-full py-20 text-center border border-dashed rounded-[3rem] border-primary/10">
               <p className="text-muted-foreground italic text-sm">Waiting for more campus buzz to generate radar insights...</p>
             </div>
          )}
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
            <div className="w-full max-w-sm mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search hackathons..."
                  className="pl-8"
                  value={hackathonSearch}
                  onChange={(e) => setHackathonSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full min-h-[300px] flex items-center">
              {loading ? (
                <LoadingThrobber />
              ) : filteredHackathons.length > 0 ? (
                <EventCarousel events={filteredHackathons} />
              ) : (
                <div className="w-full py-12 text-center border-2 border-dashed rounded-xl">
                  <p className="text-muted-foreground">No hackathons found matching "{hackathonSearch}"</p>
                </div>
              )}
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
            <div className="w-full max-w-sm mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search workshops..."
                  className="pl-8"
                  value={workshopSearch}
                  onChange={(e) => setWorkshopSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full min-h-[300px] flex items-center">
              {loading ? (
                <LoadingThrobber />
              ) : filteredWorkshops.length > 0 ? (
                <EventCarousel events={filteredWorkshops} />
              ) : (
                <div className="w-full py-12 text-center border-2 border-dashed rounded-xl">
                  <p className="text-muted-foreground">No workshops found matching "{workshopSearch}"</p>
                </div>
              )}
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
              <AboutModal>
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
              </AboutModal>
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
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting || subscriptionStatus === "success"}
                />
                <ConfettiButton 
                  type="submit"
                  href="#" 
                  className={`group subscribe-btn ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={submitting || subscriptionStatus === "success"}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : subscriptionStatus === "success" ? (
                    "Subscribed!"
                  ) : (
                    "Subscribe"
                  )}
                </ConfettiButton>
              </form>
              {subscriptionStatus === "success" && (
                <p className="text-sm text-green-500 font-medium animate-in fade-in slide-in-from-top-1">
                  Welcome to the sphere. Your event alerts are now active.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
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
      <SignInPrompt />
      <AboutModal />

      {/* Floating AI Pathfinder */}
      <AnimatePresence>
        {showPathfinder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-24 right-8 z-50"
          >
            <PathfinderModal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
