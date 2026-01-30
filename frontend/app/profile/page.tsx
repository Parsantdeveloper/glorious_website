import Sidebar from '@/components/profile/sidebar'
import UserDetails from '@/components/profile/user-details'
import AddressManagerClient from '@/components/profile/address-manager'
import { headers } from 'next/headers'

export default async function ProfilePage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/address/me`, {
    cache: 'no-store',
    credentials: 'include',
    headers: await headers(),
  })

  const data = await res.json()
  console.log(data.data)
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <UserDetails />
          <div className="mt-12">
            <AddressManagerClient addresses={data.data} />
          </div>
        </div>
      </main>
    </div>
  )
}
