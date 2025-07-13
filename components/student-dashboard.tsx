"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MaintenanceRequestForm } from "@/components/maintenance-request-form"
import { EventRequestForm } from "@/components/event-request-form"
import { ChatBot } from "@/components/chat-bot"
import { AnnouncementsList } from "@/components/announcements-list"
import { RequestsList } from "@/components/requests-list"
import {
  Wrench,
  Calendar,
  MessageCircle,
  Bell,
  GraduationCap,
  User,
} from "lucide-react"
import { useTheme } from "next-themes"
import { StudentEventPermissions } from "@/components/student-event-permissions"
import { useAuth } from "@/components/auth-provider"

export function StudentDashboard() {
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showChatBot, setShowChatBot] = useState(false)
  const { theme } = useTheme()
  const { userData } = useAuth() 

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors">
      {/* 🧭 Top Navbar */}
      <header className="bg-card border-b shadow top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-accent" />
            <h1 className="text-xl font-bold text-primary tracking-tight">
              Student Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 border rounded-full bg-muted shadow-sm">
            <User className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Welcome, Student
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-0 py-6 space-y-10">
        {/* 🚀 Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer border-none shadow-lg bg-card hover:shadow-xl transition-all"
            onClick={() => setShowMaintenanceForm(true)}
          >
            <CardHeader className="flex items-center gap-3 pb-0">
              <Wrench className="h-6 w-6 text-accent" />
              <CardTitle className="text-base font-semibold">Maintenance Request</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Report infrastructure issues
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-none shadow-lg bg-card hover:shadow-xl transition-all"
            onClick={() => setShowEventForm(true)}
          >
            <CardHeader className="flex items-center gap-3 pb-0">
              <Calendar className="h-6 w-6 text-green-600" />
              <CardTitle className="text-base font-semibold">Event Permission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Request event approvals
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-none shadow-lg bg-card hover:shadow-xl transition-all"
            onClick={() => setShowChatBot(true)}
          >
            <CardHeader className="flex items-center gap-3 pb-0">
              <MessageCircle className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Ask queries or get help instantly
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 🧾 Requests & Announcements Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md rounded-xl bg-card border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">📋 My Requests</CardTitle>
              <CardDescription>
                Track status of your submitted requests
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
              <RequestsList />
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl bg-card border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">🔔 Announcements</CardTitle>
              <CardDescription>
                Latest updates from administration
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
              <AnnouncementsList />
            </CardContent>
          </Card>
        </div>

        {/* 📋 Event Requests (full width below grid) */}
        <Card className="shadow-md rounded-xl bg-card border mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">📋 Event Requests</CardTitle>
            <CardDescription>Track your event permission submissions</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
            {userData?.uid && <StudentEventPermissions userId={userData.uid} />}
          </CardContent>
        </Card>

        {/* Modals */}
        <MaintenanceRequestForm open={showMaintenanceForm} onOpenChange={setShowMaintenanceForm} />
        <EventRequestForm open={showEventForm} onOpenChange={setShowEventForm} />
        <ChatBot open={showChatBot} onOpenChange={setShowChatBot} />
      </main>

      {/* 🌐 Footer */}
      <footer className="bg-card border-t text-sm text-muted-foreground text-center py-5">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Government Engineering College. All rights reserved.
          </p>
          <p className="text-xs mt-1">
            Developed by CampusEase Team |{" "}
            <a href="#" className="underline hover:text-primary">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  )
}