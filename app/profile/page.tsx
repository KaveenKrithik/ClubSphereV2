"use client"

import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, ArrowLeft, LogOut, User as UserIcon, Mail, Clock, Bell, CheckCircle2, XCircle, GraduationCap, Shield, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [fetchingSub, setFetchingSub] = useState(true)
  const [updatingSub, setUpdatingSub] = useState(false)

  useEffect(() => {
    if (user) {
      checkSubscription()
    }
  }, [user])

  const checkSubscription = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('email', user?.email)
      .single()
    
    if (data) setIsSubscribed(true)
    setFetchingSub(false)
  }

  const toggleSubscription = async (checked: boolean) => {
    setUpdatingSub(true)
    const supabase = createClient()
    
    if (checked) {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email: user?.email }])
      
      if (!error) {
        setIsSubscribed(true)
        toast.success("Event alerts activated")
      }
    } else {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('email', user?.email)
      
      if (!error) {
        setIsSubscribed(false)
        toast.success("Event alerts deactivated")
      }
    }
    setUpdatingSub(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    redirect("/sign-in")
    return null
  }

  // Actual data from Supabase user object
  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : "Recent"

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
            <Card className="border-border/50 shadow-sm relative overflow-hidden group">

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

            {/* Smart Alerts (The Sentinel) */}
            <Card className="border-border/50 shadow-sm border-l-4 border-l-primary/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  The Sentinel
                </CardTitle>
                <CardDescription>Intelligent campus reminders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-primary font-black tracking-widest">Active Insight</span>
                    <p className="text-xs leading-relaxed">No upcoming sessions in the next 24 hours. Perfect time to explore the <Link href="/#clubs" className="underline font-bold">Clubs</Link> section.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full text-[10px] uppercase tracking-widest font-bold" onClick={() => toast.info("Sentinel is scanning for updates...")}>
                  Refresh Analysis
                </Button>
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

            {/* Newsletter Subscription */}
            <Card className="border-border/50 shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Communication Preferences
                </CardTitle>
                <CardDescription>Manage how we keep you updated on campus events.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Newsletter & Alerts</span>
                      {isSubscribed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summaries of hackathons, workshops, and exclusive club opportunities.
                    </p>
                  </div>
                  <Switch 
                    checked={isSubscribed} 
                    onCheckedChange={toggleSubscription}
                    disabled={updatingSub || fetchingSub}
                  />
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center">
                  <p className="text-xs text-muted-foreground">
                    We hate spam as much as you do. You'll only receive high-quality, relevant updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-8 pt-12 border-t border-primary/5">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">Skill Passport</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold opacity-60">Verified Credentials</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <BadgeCard title="Early Adopter" description="Joined ClubSphere V2" icon={<Zap className="h-6 w-6" />} date={joinedDate} verified />
              <BadgeCard title="First Enroll" description="Enrolled in an event" icon={<CheckCircle2 className="h-6 w-6" />} disabled />
              <BadgeCard title="Hackathon Pro" description="Won a campus hackathon" icon={<GraduationCap className="h-6 w-6" />} disabled />
              <BadgeCard title="Workshop Lead" description="Organized a session" icon={<Users className="h-6 w-6" />} disabled />
            </div>
          </section>

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

function BadgeCard({ title, description, icon, date, verified, disabled }: any) {
  return (
    <div className={`group relative p-6 rounded-[2rem] border transition-all duration-500 ${disabled ? 'opacity-20 grayscale' : 'border-primary/10 bg-primary/[0.02] hover:border-primary/30 hover:bg-primary/[0.04]'}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-2xl ${disabled ? 'bg-muted' : 'bg-primary/5 text-primary'} transition-colors group-hover:bg-primary/10`}>
            {icon}
          </div>
          {verified && !disabled && (
            <div className="h-6 w-6 rounded-full border border-primary/20 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black uppercase tracking-widest">{title}</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-wider opacity-60">{description}</p>
        </div>
        {date && !disabled && (
          <div className="pt-2 border-t border-primary/5">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/40">{date}</span>
          </div>
        )}
      </div>
    </div>
  )
}
