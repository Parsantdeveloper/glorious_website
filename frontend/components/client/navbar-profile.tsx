import { headers } from "next/headers"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const NavbarProfile = async () => {
  const res = await fetch("http://localhost:4000/api/user/me", {
    cache: "no-store",
    credentials: "include",
    headers: await headers(),
  })

  const session = await res.json()

  // NOT LOGGED IN → SHOW LOGIN
  if (!session) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
      >
        Login
      </Link>
    )
  }

  const { name, email, image } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-full border border-border p-1 hover:bg-accent">
          <Avatar className="h-9 w-9">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>
              {name?.charAt(0).toUpperCase()||"P"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* USER INFO */}
        <div className="px-3 py-2 ">
          <p className="text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {email}
          </p>
        </div>

        <DropdownMenuItem asChild>
          <Link href="/profile">My Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/logout" className="text-destructive">
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavbarProfile
