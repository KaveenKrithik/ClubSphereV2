"use client"

import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Trophy, Award, Calendar, Star, ArrowLeft, LogOut, User as UserIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    redirect("/sign-in")
  }

  // Mock data for history, badges, and points
  const points = 1250
  const badges = [
    { id: 1, name: "Early Bird", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { id: 2, name: "Bug Hunter", icon: Award, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 3, name: "Event Master", icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 4, name: "Community Star", icon: Star, color: "text-pink-500", bg: "bg-pink-500/10" },
  ]

  const history = [
    { id: 1, title: "SuperHack 2026", date: "Sept 10, 2026", points: 500, type: "Hackathon" },
    { id: 2, title: "IoT Workshop", date: "Aug 30, 2026", points: 200, type: "Workshop" },
    { id: 3, title: "Digital Twin Seminar", date: "Aug 24, 2026", points: 150, type: "Seminar" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-10 max-w-5xl">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Sidebar - User Info & Stats */}
          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-xl bg-primary/5 dark:bg-primary/10 backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                      <AvatarFallback><UserIcon /></AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-full border-4 border-background">
                      <Trophy className="h-4 w-4" />
                    </div>
                  </div>
                  <CardTitle className="mt-4 break-all">{user.email?.split('@')[0]}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm font-medium">Rank</span>
                    <Badge variant="secondary" className="font-bold">Gold III</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm font-medium">Total Points</span>
                    <span className="text-xl font-bold text-primary">{points}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Badges</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  {badges.map((badge) => (
                    <div key={badge.id} className={`flex flex-col items-center p-3 rounded-xl ${badge.bg} border border-transparent hover:border-primary/20 transition-all`}>
                      <badge.icon className={`h-8 w-8 mb-2 ${badge.color}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{badge.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </aside>

          {/* Main Content - History & Activities */}
          <section className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    <Card className="hover:shadow-md transition-shadow overflow-hidden group">
                      <div className="flex items-center p-4 gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">{item.type} • {item.date}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-primary">+{item.points}</span>
                              <p className="text-[10px] text-muted-foreground uppercase">Points earned</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Gamification Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Level 12</span>
                      <span>{points} / 2000 XP</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(points / 2000) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center italic">
                      750 more XP to reach Level 13 and unlock the "Elite Mentor" badge!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  )
}
