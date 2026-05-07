"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

export function useLikes() {
  const [likedEvents, setLikedEvents] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("likedEvents")
    if (saved) {
      try {
        setLikedEvents(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse liked events", e)
      }
    }
  }, [])

  const toggleLike = (eventId: string) => {
    setLikedEvents(prev => {
      const isLiked = prev.includes(eventId)
      const newLikes = isLiked
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
      
      localStorage.setItem("likedEvents", JSON.stringify(newLikes))
      
      if (!isLiked) {
        toast.success("Event added to your favorites")
      }
      
      return newLikes
    })
  }

  const isLiked = (eventId: string) => likedEvents.includes(eventId)

  return { likedEvents, toggleLike, isLiked }
}
