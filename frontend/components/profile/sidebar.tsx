'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navLinks = [
    {
      href: '/profile',
      label: 'Profile',
      icon: Settings,
    },
  ]

  return (
    <aside className="w-64 border-r border-border bg-background p-6 flex flex-col h-screen">
      {/* Logo/Brand */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">MyStore</h1>
        <p className="mt-1 text-sm text-muted-foreground">Account Management</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <Button
       onClick={()=>router.push("/logout")}
        variant="outline"
        className="w-full gap-2 cursor-pointer border-border text-foreground hover:bg-destructive hover:text-destructive-foreground bg-transparent"
      > Logout
        <LogOut size={18} />
      </Button>
    </aside>
  )
}
