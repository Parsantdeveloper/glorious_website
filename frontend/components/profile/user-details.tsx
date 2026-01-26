'use client'

import { Card } from '@/components/ui/card'
import { Mail, User, Calendar } from 'lucide-react'

interface UserDetailsProps {
  user: {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string
    createdAt: string
  }
}

export default function UserDetails({ user }: UserDetailsProps) {
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">Profile Information</h2>
        <p className="mt-1 text-muted-foreground">Your account details secured with Google authentication</p>
      </div>

      <Card className="border-border bg-card p-8">
        <div className="space-y-8">
          {/* Profile Header with Avatar */}
          <div className="flex items-center gap-6 border-b border-border pb-8">
            {user.image ? (
              <img
                src={user.image || "/placeholder.svg"}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <span className="text-2xl font-semibold text-secondary-foreground">{user.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="text-2xl font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {user.emailVerified ? 'Email Verified' : 'Email Not Verified'}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <User size={16} />
                Full Name
              </div>
              <p className="text-foreground">{user.name}</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Mail size={16} />
                Email Address
              </div>
              <p className="break-all text-foreground">{user.email}</p>
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar size={16} />
                Member Since
              </div>
              <p className="text-foreground">{formattedDate}</p>
            </div>

            {/* Authentication Method */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <div className="h-4 w-4 rounded bg-primary"></div>
                Authentication
              </div>
              <p className="text-foreground">Google OAuth</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="rounded-lg bg-secondary px-4 py-4 text-sm text-secondary-foreground">
            <p>
              Your account is protected with Google authentication. Password recovery and changes are not available as your identity is verified through Google.
            </p>
          </div>
        </div>
      </Card>
    </section>
  )
}
