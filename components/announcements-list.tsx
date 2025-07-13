"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getAnnouncements } from "@/app/actions"
import { Calendar, User, AlertCircle } from "lucide-react"

interface Announcement {
  id: string
  title: string
  message: string
  audience: string
  authorName: string
  authorEmail: string
  priority: string
  createdAt: any
}

interface AnnouncementsListProps {
  showAuthor?: boolean
}

export function AnnouncementsList({ showAuthor = true }: AnnouncementsListProps) {
  const { userData } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userData) {
      loadAnnouncements()
    }
  }, [userData])

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements()
      setAnnouncements(data)
    } catch (error) {
      console.error("Error loading announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-[#FFDBDB] text-[#7C1D1D]"
      case "high":
        return "bg-[#FFE5C1] text-[#7A4100]"
      case "medium":
        return "bg-[#FFF7CC] text-[#8A6D00]"
      case "low":
        return "bg-[#D7F5D3] text-[#2E6B2E]"
      default:
        return "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
    }
  }

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case "all":
        return "bg-[#D8CFBC] text-[#11120D]"
      case "students":
        return "bg-[#FFFBF4] text-[#565449]"
      case "faculty":
        return "bg-[#E6E1D3] text-[#333229]"
      default:
        return "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-[hsl(var(--muted-foreground))]">Loading announcements...</div>
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--muted))]" />
        <p>No announcements found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card
          key={announcement.id}
          className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-sm"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-lg">{announcement.title}</h4>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(announcement.priority)}>
                  {announcement.priority}
                </Badge>
                <Badge className={getAudienceColor(announcement.audience)}>
                  {announcement.audience}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3 whitespace-pre-wrap">
              {announcement.message}
            </p>

            <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(announcement.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
              </div>
              {showAuthor && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {announcement.authorName}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}