"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AnnouncementForm } from "@/components/announcement-form"
import { AllRequestsList } from "@/components/all-requests-list"
import { AnnouncementsList } from "@/components/announcements-list"
import { RequestsChart } from "@/components/requests-chart"
import { useTheme } from "next-themes"
import {
  Plus,
  BarChart3,
  FileText,
  GraduationCap,
  User,
} from "lucide-react"

export function FacultyDashboard() {
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const { theme, setTheme } = useTheme()
  const [refreshChart, setRefreshChart] = useState(false)
  const router = useRouter()

  const handleStatusChange = () => {
    setRefreshChart((prev) => !prev)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* 🧭 Navbar */}
      <header className="bg-[hsl(var(--card))] border-b shadow">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-black-600" />
            <h1 className="text-lg font-semibold tracking-tight">
              Faculty Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, Faculty
            </span>
          </div>
        </div>
      </header>

      {/* 📦 Main content */}
      <main className="flex-1 w-full px-0 py-6 space-y-10">
        {/* 🔧 Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <Card
            role="button"
            tabIndex={0}
            className="hover:shadow-xl transition-all cursor-pointer border-blue-100"
            onClick={() => setShowAnnouncementForm(true)}
          >
            <CardHeader className="flex items-center gap-3 pb-0">
              <Plus className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Create Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-muted-foreground">
                Post updates for students
              </p>
            </CardContent>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            className="hover:shadow-xl transition-all cursor-pointer border-green-100"
            onClick={() => router.push("/faculty/request-analytics")}
          >
            <CardHeader className="flex items-center gap-3 pb-0">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Request Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-muted-foreground">
                View request statistics
              </p>
            </CardContent>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            className="hover:shadow-xl transition-all cursor-pointer border-purple-100"
            onClick={() => router.push("/faculty/permissions")}
          >
            <CardHeader className="flex items-center gap-3 pb-0">
              <FileText className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">Permissions Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-muted-foreground">
                View submitted permission letters
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 📊 Chart Block */}
        <div className="px-4">
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">📈 Request Analytics</CardTitle>
              <CardDescription>Overview of request statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <RequestsChart key={refreshChart ? "chart-a" : "chart-b"} />
            </CardContent>
          </Card>
        </div>

        {/* 📋 Requests + 🔔 Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">📋 All Requests</CardTitle>
              <CardDescription>Review and manage student requests</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
              <AllRequestsList onStatusChange={handleStatusChange} />
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">🔔 Announcements</CardTitle>
              <CardDescription>Your posted announcements</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
              <AnnouncementsList showAuthor={false} />
            </CardContent>
          </Card>
        </div>

        {/* 📢 Modal */}
        <AnnouncementForm
          open={showAnnouncementForm}
          onOpenChange={setShowAnnouncementForm}
        />
      </main>

      {/* 🌐 Footer */}
      <footer className="bg-[hsl(var(--card))] border-t text-sm text-muted-foreground text-center py-5">
        <div className="w-full px-4">
          <p>© {new Date().getFullYear()} Government Engineering College. All rights reserved.</p>
          <p className="text-xs mt-1">
            Developed by CampusEase Team |{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}