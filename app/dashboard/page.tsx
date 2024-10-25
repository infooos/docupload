"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Users, Building2, FileText, Settings, 
  Upload, LogOut, Home, PieChart
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signOut } from 'next-auth/react'
import DashboardNav from '@/components/dashboard/DashboardNav'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { useToast } from "@/components/ui/use-toast"

interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [userRole, setUserRole] = useState('')
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
    pendingReview: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserRole()
      fetchStats()
    }
  }, [session])

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/role`)
      const data = await response.json()
      setUserRole(data.role)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user role",
        variant: "destructive"
      })
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/dashboard/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard stats",
        variant: "destructive"
      })
    }
  }

  const getMenuItems = (): MenuItem[] => {
    const baseItems = [
      { label: 'Home', icon: <Home className="w-4 h-4" />, href: '/dashboard' },
      { label: 'Documents', icon: <FileText className="w-4 h-4" />, href: '/dashboard/documents' },
      { label: 'Upload', icon: <Upload className="w-4 h-4" />, href: '/upload' },
    ]

    if (userRole === 'company_user') {
      return [
        ...baseItems,
        { label: 'Team', icon: <Users className="w-4 h-4" />, href: '/dashboard/team' },
        { label: 'Reports', icon: <PieChart className="w-4 h-4" />, href: '/dashboard/reports' },
      ]
    }

    if (userRole === 'superadmin') {
      return [
        ...baseItems,
        { label: 'Companies', icon: <Building2 className="w-4 h-4" />, href: '/dashboard/companies' },
        { label: 'Users', icon: <Users className="w-4 h-4" />, href: '/dashboard/users' },
        { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '/dashboard/settings' },
      ]
    }

    return baseItems
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={session?.user}
        onSignOut={() => signOut()}
      />
      
      <div className="flex">
        <DashboardNav menuItems={getMenuItems()} />
        
        <main className="flex-1 p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCases}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeCases}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedCases}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingReview}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              {userRole === 'company_user' && (
                <TabsTrigger value="team">Team</TabsTrigger>
              )}
              {userRole === 'superadmin' && (
                <TabsTrigger value="system">System</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No recent cases to display.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}