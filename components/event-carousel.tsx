"use client"
import Link from "next/link"
import { Calendar, MapPin, ExternalLink } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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

interface EventCarouselProps {
  events: Event[]
}

export function EventCarousel({ events }: EventCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {events.map((event) => (
          <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <Card className="h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
                  <img
                    src={event.image || "https://placehold.co/600x400/e2e8f0/1e293b?text=Event+Poster"}
                    alt={event.title}
                    className="h-full w-full object-cover transition-all hover:scale-105 duration-500"
                  />
                  {event.isExternal && (
                    <Badge variant="secondary" className="absolute top-2 right-2 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      External
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="line-clamp-1 mb-2">{event.title}</CardTitle>
                <p className="text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={event.enrollmentLink}>Enroll Now</Link>
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  )
}

