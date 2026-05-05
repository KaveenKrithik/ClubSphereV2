
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Plus, Search, MessageSquare, Code, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"
import { AnimatedCard, CardContent, CardHeader, CardTitle } from "@/components/animated-card"

export default function TeamsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    const { data, error } = await supabase
      .from('team_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) {
      setRequests(data || [])
    }
    setLoading(false)
  }

  const filteredRequests = requests.filter(req => 
    req.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.skills_needed.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 space-y-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Team Matchmaker</h1>
            <p className="text-muted-foreground">Find your perfect teammates for upcoming hackathons and workshops.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by event or skill..." 
                className="pl-10 bg-muted/50 border-primary/10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {user && <CreateRequestDialog onCreated={fetchRequests} />}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-3xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <AnimatedCard className="h-full border-primary/10 hover:border-primary/30 transition-all rounded-3xl overflow-hidden group">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-3">
                          {req.event_name}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors line-clamp-1">
                        Looking for Team
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          <Code className="h-3 w-3" />
                          Skills Needed
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {req.skills_needed.map((skill: string) => (
                            <Badge key={skill} variant="outline" className="rounded-full text-[10px] font-bold">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-primary/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                            {req.user_name[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{req.user_name}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="rounded-full gap-2 hover:bg-primary hover:text-white transition-all" asChild>
                           <a href={`mailto:${req.contact_info}`}>
                             <MessageSquare className="h-4 w-4" />
                             Contact
                           </a>
                        </Button>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

function CreateRequestDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const { error } = await supabase
      .from('team_requests')
      .insert({
        user_id: user?.id,
        user_name: user?.email?.split('@')[0], // Simplified name
        event_name: formData.get('event_name'),
        skills_needed: (formData.get('skills') as string).split(',').map(s => s.trim()),
        contact_info: user?.email,
      })

    if (error) {
      toast.error("Failed to post request")
    } else {
      toast.success("Team request posted!")
      setOpen(false)
      onCreated()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full gap-2 px-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] p-8 border-primary/20 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Post Team Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Event Name</label>
            <Input name="event_name" placeholder="e.g. SRM Hackathon 2025" required className="rounded-2xl bg-muted/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Skills Needed</label>
            <Input name="skills" placeholder="e.g. React, Python, UI Design" required className="rounded-2xl bg-muted/50" />
            <p className="text-[10px] text-muted-foreground ml-1">Separate skills with commas</p>
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-2xl h-12 text-lg font-bold">
            {loading ? "Posting..." : "Post Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
