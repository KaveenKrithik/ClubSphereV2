
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Brain, Target, Compass, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function PathfinderModal() {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  const startAnalysis = () => {
    setLoading(true)
    // Simulate AI thinking
    setTimeout(() => {
      setRecommendations([
        { title: "IoT Alliance Induction", reason: "Best for hardware-software integration which matches your Robotics goal.", type: "Club" },
        { title: "DevFocus Hackathon", reason: "A perfect place to apply your React skills in a high-pressure environment.", type: "Event" },
        { title: "Cloud Fundamentals Workshop", reason: "Essential for scaling the applications you want to build.", type: "Workshop" }
      ])
      setLoading(false)
      setStep(1)
    }, 2000)
  }

  return (
    <Dialog onOpenChange={() => { setStep(0); setGoal(""); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 group shadow-lg">
          <Sparkles className="h-4 w-4 text-primary group-hover:animate-pulse" />
          AI Pathfinder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-[2.5rem] border-primary/20 backdrop-blur-2xl p-0 overflow-hidden shadow-2xl">
        <div className="p-8 space-y-6">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">Pathfinder AI</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Intelligent Discovery</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    What are you looking to achieve this semester? Tell me your interests or career goals, and I'll map out your campus journey.
                  </p>
                  <div className="relative group">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g. Master Web3, Win a Hackathon..." 
                      className="pl-10 rounded-2xl bg-muted/50 border-primary/10 h-12"
                    />
                  </div>
                  <Button 
                    disabled={!goal || loading} 
                    onClick={startAnalysis}
                    className="w-full rounded-2xl h-12 text-lg font-bold shadow-xl shadow-primary/20"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Generate My Path"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Compass className="h-5 w-5 text-primary" />
                     <h2 className="text-xl font-black">Your Strategy</h2>
                   </div>
                   <Button variant="ghost" size="sm" onClick={() => setStep(0)} className="text-xs">Reset</Button>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1 hover:bg-primary/10 transition-colors cursor-default"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{rec.type}</span>
                        <ArrowRight className="h-3 w-3 text-primary/40" />
                      </div>
                      <h4 className="font-bold text-sm">{rec.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-tight">{rec.reason}</p>
                    </motion.div>
                  ))}
                </div>

                <p className="text-[10px] text-center text-muted-foreground italic">
                  Analysis based on current event availability and club activities.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
