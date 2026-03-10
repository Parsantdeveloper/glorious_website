'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/spinner"

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    authClient.signOut().then(() => {
      router.replace("/login") // or /login
    })
  }, [router])

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex items-center gap-2 text-red-500">
        Logging out <Spinner />
      </div>
    </div>
  )
}
