"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { GraduationCap, LogOut } from "lucide-react"

export function Navbar() {
  const { userData, logout } = useAuth()

  return (
    <nav className="w-full bg-primary text-primary-foreground shadow-md top-0 z-50">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-highlight" />
          <h1 className="text-2xl font-bold tracking-wide">CampusEase</h1>
        </div>

        {/* Right side - User info and Logout */}
        <div className="flex items-center space-x-4">
          <div className="text-right text-sm leading-tight">
            <div className="font-semibold">{userData?.name}</div>
            <div className="text-accent capitalize">{userData?.role}</div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="border hover:bg-highlight hover:text-primary transition"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}