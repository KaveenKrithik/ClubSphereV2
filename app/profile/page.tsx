"use client"

import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, ArrowLeft, LogOut, User as UserIcon, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  // Actual data from Supabase user object
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

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
            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign Out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Profile Summary */}
          <section className="flex flex-col md:flex-row gap-8 items-start">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-border shadow-sm">
              <UserIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2 flex-1">
              <h1 className="text-4xl font-bold tracking-tight">Account Settings</h1>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-primary/5 text-primary border-primary/20">Active User</span>
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Details */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>Details associated with your Google account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Email Address</span>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Member Since</span>
                    <span className="text-sm font-medium">{joinedDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Activity Stats</CardTitle>
                <CardDescription>Your engagement across the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 border rounded-lg text-center">
                    <span className="text-2xl font-bold block">0</span>
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Enrollments</span>
                  </div>
                  <div className="p-4 bg-muted/20 border rounded-lg text-center">
                    <span className="text-2xl font-bold block">0</span>
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Points Earned</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/20 border rounded-lg">
                  <span className="text-sm text-muted-foreground block text-center italic">
                    Start enrolling in hackathons to track your progress.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed History Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-2xl font-bold">Enrollment History</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/#hackathons">Explore Events</Link>
              </Button>
            </div>
            
            <div className="min-h-[200px] flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/10">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No history found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                Your event participation and workshop attendance will appear here once you enroll.
              </p>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  )
}
