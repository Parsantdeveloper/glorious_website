import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import ClientAuthProvider from '@/components/client/client-provider'

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
    cache: 'no-store',
    credentials: 'include',
    headers: await headers(),
  })

  if (!res.ok) redirect('/') // not logged in

  const data = await res.json() // contains { session, user }

  const user = data.user // ✅ pick the correct property

  if (!user) redirect('/') // safeguard
  console.log(user)

  return (
    <ClientAuthProvider user={user}>
      {children}
    </ClientAuthProvider>
  )
}
