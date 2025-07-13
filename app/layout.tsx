import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CampusEase - Campus Management System",
  description: "AI-powered campus management system for students and faculty",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-background text-foreground">
  <AuthProvider>
    {children}
    <Toaster />
  </AuthProvider>
</body>
    </html>
  )
}