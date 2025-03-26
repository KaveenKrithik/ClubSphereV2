"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Event {
  id: string
  title: string
  description: string
  date: string
  venue: string
  image: string
  isExternal: boolean
  enrollmentLink: string
}

interface EventCalendarProps {
  events: Event[]
  children?: React.ReactNode
}

export function EventCalendar({ events, children }: EventCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Convert string dates to Date objects for comparison
  const eventDates = events.map((event) => {
    const dateParts = event.date.split("-")[0].trim().split(" ")[1].split(",")[0]
    const month = new Date(Date.parse(event.date.split("-")[0].trim().split(" ")[0] + " 1, 2025")).getMonth()
    return {
      ...event,
      dateObj: new Date(2025, month, Number.parseInt(dateParts)),
    }
  })

  // Get events for the selected date
  const selectedDateEvents = date
    ? eventDates.filter(
        (event) => event.dateObj.getDate() === date.getDate() && event.dateObj.getMonth() === date.getMonth(),
      )
    : []

  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return eventDates.some(
      (event) => event.dateObj.getDate() === day.getDate() && event.dateObj.getMonth() === day.getMonth(),
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event Calendar</DialogTitle>
          <DialogDescription>Browse events by date. Dates with events are highlighted.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  setIsCalendarOpen(false)
                }}
                modifiers={{
                  hasEvent: (date) => isDayWithEvent(date),
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: "bold",
                    backgroundColor: "hsl(var(--primary) / 0.2)",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="rounded-md border"
                components={{
                  IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                  IconRight: () => <ChevronRight className="h-4 w-4" />,
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="rounded-md border">
            <div className="p-4 border-b">
              <h3 className="font-medium">
                {selectedDateEvents.length
                  ? `Events on ${date ? format(date, "MMMM d, yyyy") : ""}`
                  : "No events on this date"}
              </h3>
            </div>
            <ScrollArea className="h-[200px]">
              {selectedDateEvents.length > 0 ? (
                <div className="p-4 space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{event.title}</h4>
                          {event.isExternal && (
                            <Badge variant="outline" className="text-xs">
                              External
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{event.venue}</p>
                        <a href={event.enrollmentLink} className="text-xs text-primary hover:underline">
                          Enroll Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No events scheduled for this date.</p>
                  <p className="text-sm mt-2">Try selecting a different date.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

