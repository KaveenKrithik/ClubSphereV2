
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Brain, Target, Compass, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function PathfinderModal({ events = [] }: { events?: any[] }) {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  const startAnalysis = () => {
    setLoading(true)
    
    // Simulate AI thinking and then perform dynamic matching
    setTimeout(() => {
      const userGoal = goal.toLowerCase()
      
      // Simple semantic matching logic
      const matched = events
        .filter(event => {
          const content = (event.title + " " + event.description).toLowerCase()
          // Check for keyword matches
          return content.includes(userGoal) || 
                 userGoal.split(" ").some(word => word.length > 3 && content.includes(word))
        })
        .slice(0, 3)
        .map(event => ({
          title: event.title,
          reason: `Highly relevant to your goal of "${goal}". This ${event.isExternal ? 'external' : 'SRM'} opportunity aligns with your profile.`,
          link: event.enrollmentLink,
          type: event.isExternal ? 'Global' : 'Internal'
        }))

      // Fallback if no specific matches found
      const finalRecommendations = matched.length >= 2 ? matched : [
        ...matched,
        ...events
          .filter(e => !matched.find(m => m.title === e.title))
          .slice(0, 3 - matched.length)
          .map(event => ({
            title: event.title,
            reason: `Strategy: This event is currently trending in the SRM ecosystem and could broaden your horizons while pursuing "${goal}".`,
            link: event.enrollmentLink,
            type: event.isExternal ? 'Global' : 'Internal'
          }))
      ]

      setRecommendations(finalRecommendations)
      setLoading(false)
      setStep(1)
    }, 1500)
  }

  return (
    <Dialog onOpenChange={() => { setStep(0); setGoal(""); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-primary/20 bg-background/80 backdrop-blur-xl shadow-2xl hover:scale-110 transition-transform group">
          <Sparkles className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
          <span className="sr-only">AI Pathfinder</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-[2.5rem] border-primary/20 backdrop-blur-2xl p-0 overflow-hidden shadow-2xl">
        <div className="p-8 space-y-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-black">Pathfinder AI</DialogTitle>
            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Strategic Planning</p>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >

                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-2xl font-light leading-snug tracking-tight">
                      What are you looking to <span className="text-primary font-medium italic">achieve</span> this semester?
                    </p>
                    <div className="relative group">
                      <Input 
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. Master Web3, Win a Hackathon..." 
                        className="rounded-none border-0 border-b border-primary/20 bg-transparent h-12 px-0 focus-visible:ring-0 focus-visible:border-primary transition-all text-lg"
                      />
                    </div>
                  </div>
                  <Button 
                    disabled={!goal || loading} 
                    onClick={startAnalysis}
                    variant="ghost"
                    className="group p-0 h-auto hover:bg-transparent text-primary font-bold tracking-widest text-[10px] uppercase gap-2"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <>
                        Generate Strategy
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                   <h2 className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Your Strategy</h2>
                   <Button variant="link" size="sm" onClick={() => setStep(0)} className="text-[10px] uppercase font-bold p-0 h-auto">Reset</Button>
                </div>

                <div className="space-y-8">
                  {recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <a href={rec.link || "#"} target="_blank" rel="noopener noreferrer" className="space-y-2 block">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-primary/40">0{i + 1}</span>
                          <h4 className="font-bold tracking-tight text-lg group-hover:text-primary transition-colors">{rec.title}</h4>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed pl-7 max-w-[280px]">
                          {rec.reason}
                        </p>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
