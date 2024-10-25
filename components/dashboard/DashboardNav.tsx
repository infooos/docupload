"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
}

interface DashboardNavProps {
  menuItems: MenuItem[]
}

export default function DashboardNav({ menuItems }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block w-64 min-h-screen bg-white border-r border-gray-200 px-3 py-4">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href && "bg-gray-100"
              )}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}