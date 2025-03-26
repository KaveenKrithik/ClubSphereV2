"use client"
import Link from "next/link"
import { Users, Calendar } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface Club {
  id: string
  name: string
  description: string
  memberCount: number
  foundedYear: number
  logo: string
  enrollmentLink: string
}

interface ClubCarouselProps {
  clubs: Club[]
}

export function ClubCarousel({ clubs }: ClubCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {clubs.map((club) => (
          <CarouselItem key={club.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-col items-center text-center p-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-muted flex items-center justify-center">
                  <img
                    src={club.logo || "https://placehold.co/200x200/e2e8f0/1e293b?text=Club+Logo"}
                    alt={club.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{club.name}</h3>
              </CardHeader>
              <CardContent className="flex-grow px-6">
                <p className="text-muted-foreground text-center mb-6">{club.description}</p>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    <span>{club.memberCount} members</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    <span>Est. {club.foundedYear}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href={club.enrollmentLink}>Join Club</Link>
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

