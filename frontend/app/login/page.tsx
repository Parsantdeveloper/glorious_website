import LoginClient from "@/components/client/login-component"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
export default async function LoginPage() {
  const res = await fetch("http://localhost:4000/api/user/me", {
    cache: "no-store",
    credentials: "include",
    headers:await headers()
  })

  const session = await res.json()

  if (session) {
    redirect("/")
  }

  return <LoginClient />
}
