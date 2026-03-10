// app/dashboard/banners/page.tsx (SERVER COMPONENT)
import { api } from '@/lib/axiosInstance'
import BannerPageClient from '@/components/admin/banners/banner-client'
import { headers } from 'next/headers'

export default async function Page() {
  
 async function getBanners()
  {
   try {
     const responce = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banner`, {
      headers:await headers(),
      cache:'no-cache',
     })
    const data = await responce?.json()
    return data.data 
   } catch (error) {
    console.error('Error fetching banners:', error)
    return []
   }
   
  }
  return <BannerPageClient initialBanners={await getBanners()} />
}
