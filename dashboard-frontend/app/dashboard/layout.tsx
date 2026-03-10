import React from "react"
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {Toaster} from "react-hot-toast"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/user', label: 'User', icon: '👥' },
    { href: '/dashboard/order', label: 'Order', icon: '📦' },
    { href: '/dashboard/product', label: 'Product', icon: '🛍️' },
    { href: '/dashboard/category', label: 'Category', icon: '🏷️' },
    { href: '/dashboard/banner', label: 'Banner', icon: '🖼️' },
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-black">Dashboard</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200">
          <Link href="/logout" className="w-full">
            <Button
              className="w-full flex items-center justify-center gap-2 bg-red-600 border-black text-white cursor-pointer hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        <Toaster />

        </div>
      </main>

    </div>
  )
}
