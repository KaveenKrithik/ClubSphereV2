
"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Code,
  Users,
  Home,
  LogOut,
  GraduationCap,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 border rounded-lg hover:bg-muted transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search ClubSphere...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/#hackathons"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Browse Hackathons</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/#workshops"))}>
              <Code className="mr-2 h-4 w-4" />
              <span>Explore Workshops</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/#clubs"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Find Clubs</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/teams"))}>
              <GraduationCap className="mr-2 h-4 w-4" />
              <span>Team Matchmaker</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem onSelect={() => runCommand(() => router.push("/profile"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            {user && (
              <CommandItem onSelect={() => runCommand(() => signOut())}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
