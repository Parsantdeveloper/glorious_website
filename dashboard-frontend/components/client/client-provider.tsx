'use client'

import { useEffect } from "react"
import { useAuthStore } from "@/app/store/useAuthStore"

interface User {
  id: string
  name: string
  email: string
  image?: string
  createdAt:Date
}

export default function ClientAuthProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  const setUser = useAuthStore(state => state.setUser)

  useEffect(() => {
    if (user) setUser(user)
  }, [user, setUser])

  return children
}
