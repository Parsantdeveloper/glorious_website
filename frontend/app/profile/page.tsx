'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/profile/sidebar'
import UserDetails from '@/components/profile/user-details'
import AddressManager from '@/components/profile/address-manager'

export default function ProfilePage() {
  


 const user ={
  "id": "user_123456",
  "name": "Prashant Bhusal",
  "email": "prashant.bhusal@gmail.com",
  "emailVerified": true,
  "image": "https://i.pravatar.cc/150?img=12",
  "createdAt": "2024-02-15T10:30:00.000Z"
}

const address =[
  {
    "id": "addr_001",
    "fullName": "Prashant Bhusal",
    "phone": "+977-9801234567",
    "addressLine": "House No. 42",
    "tole": "Budhanilkantha",
    "district": "Kathmandu",
    "city": "Kathmandu",
    "postalCode": "44600",
    "createdAt": "2024-06-10T08:15:00.000Z"
  },
  {
    "id": "addr_002",
    "fullName": "Prashant Bhusal",
    "phone": "+977-9819876543",
    "addressLine": "Near Big Mart",
    "tole": "Nayabazar",
    "district": "Kaski",
    "city": "Pokhara",
    "postalCode": "33700",
    "createdAt": "2024-08-22T14:45:00.000Z"
  }
]


  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <UserDetails user={user} />
          <div className="mt-12">
            <AddressManager userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
