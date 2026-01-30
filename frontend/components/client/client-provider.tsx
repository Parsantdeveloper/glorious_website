'use client'

import { useEffect } from "react"
import { useAuthStore } from "@/app/store/useAuthStore"

export default function ClientAuthProvider({ user, children }) {
  const setUser = useAuthStore(state => state.setUser)

  useEffect(() => {
    if (user) setUser(user)
  }, [user, setUser])

  return children
}
