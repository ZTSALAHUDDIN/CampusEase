"use client"

import { useAuth } from "@/components/auth-provider"
import { AuthForm } from "@/components/auth-form"
import { StudentDashboard } from "@/components/student-dashboard"
import { FacultyDashboard } from "@/components/faculty-dashboard"
import { Navbar } from "@/components/navbar"

export default function Home() {
  const { user, userData, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent"></div>
      </div>
    )
  }

  if (!user || !userData) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 w-full px-4 py-6 md:px-8 lg:px-12">
        {userData.role === "student" ? <StudentDashboard /> : <FacultyDashboard />}
      </main>
    </div>
  )
}