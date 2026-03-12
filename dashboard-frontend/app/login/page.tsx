import LoginClient from "@/components/client/login-component"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionFromCookieHeader } from "@/lib/auth-session"

export default async function LoginPage() {
  const session = await getSessionFromCookieHeader((await headers()).get('cookie'))

  if (session) {
    redirect("/dashboard")
  }

  return <LoginClient />
}
