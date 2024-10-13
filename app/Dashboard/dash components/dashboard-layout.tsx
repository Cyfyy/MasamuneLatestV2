"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Home, LineChart, DollarSign, FileText, Settings, ChevronLeft, Menu, Moon, Sun, LogOut } from "lucide-react" // Import the LogOut icon
import { Card, CardContent, CardHeader, CardTitle } from "@/app/Dashboard/dash components/ui/card"
import { Button } from "@/app/Dashboard/dash components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/Dashboard/dash components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/Dashboard/dash components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { Revalia } from "next/font/google"
import { TrackerSection } from "@/app/Dashboard/dash components/tracker-section"
import { DonateModal } from "@/app/Dashboard/dash components/donate-modal"
import { LogsSection } from "@/app/Dashboard/dash components/logs-section"
import { SettingsSection } from "@/app/Dashboard/dash components/settings-section"
import { DashboardOverview } from "./dashboard-overview"

const revalia = Revalia({
  subsets: ["latin"],
  weight: ["400"],
})

const navItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Tracker", icon: LineChart, href: "/tracker" },
  { name: "Donate", icon: DollarSign, href: "/donate" },
  { name: "Logs", icon: FileText, href: "/logs" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export default function DashboardLayout() {
  const { data: session } = useSession()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [username, setUsername] = useState("User")
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name)
    }
  }, [session])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "tracker":
        return <TrackerSection />
      case "donate":
        return <DonateModal />
      case "logs":
        return <LogsSection />
      case "settings":
        return <SettingsSection />
      default:
        return <DashboardOverview />
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Sidebar */}
      <aside className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && (
            <Image src="/logo.svg" alt="Masamune Logo" width={120} height={40} />
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {sidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        <nav className="space-y-2 p-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full justify-start ${activeSection.toLowerCase() === item.name.toLowerCase() ? (theme === 'dark' ? "bg-gray-700" : "bg-gray-200") : ""}`}
              onClick={() => setActiveSection(item.name.toLowerCase())}
            >
              <item.icon className={`${sidebarOpen ? 'h-5 w-5 mr-2' : 'h-6 w-6'}`} />
              {sidebarOpen && item.name}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className={`flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
          <h1 className={`text-2xl font-bold ${revalia.className}`}>
            Masamune
          </h1>
          <div className="flex items-center space-x-2">
            <span className="mr-2">{username}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-gray-300">
                    <AvatarImage src="/images/dash-pp.jpg" alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`w-56 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} align="end">
                <div className="flex flex-col items-center p-2">
                  <p className="font-semibold">Welcome, {username}</p>
                </div>
                <DropdownMenuItem className="flex justify-center" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-center" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> {/* Logout icon */}
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
