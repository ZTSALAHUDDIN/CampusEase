"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Clock, FileText } from "lucide-react"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
} from "firebase/firestore"

interface EventRequest {
  id: string
  userEmail: string
  eventName: string
  date: string
  time: string
  venue: string
  purpose: string
  expectedAttendees: number
  generatedLetter: string
  status: string
  createdAt: { seconds: number }
  requestType: "event"
}

export function EventPermissionsList() {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([])

  useEffect(() => {
    const q = query(
      collection(db, "eventRequests"),
      orderBy("createdAt", "desc")
    )

    console.log("📌 Setting up real-time event listener...")

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsOnly = snapshot.docs.map((doc: DocumentData) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.seconds
            ? { seconds: data.createdAt.seconds }
            : null,
        }
      }) as EventRequest[]
      setEventRequests(eventsOnly)
    })

    return () => unsubscribe()
  }, [])

  if (eventRequests.length === 0) {
    return (
      <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
        No event permissions found.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {eventRequests.map((req) => (
        <Card key={req.id} className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold">{req.eventName}</h4>
                <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                  <User className="h-3 w-3" /> {req.userEmail}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {req.venue}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {req.status}
              </Badge>
            </div>

            <p className="text-sm text-[hsl(var(--foreground))]">
              📅 {req.date} &nbsp; ⏰ {req.time}
            </p>

            <p className="text-sm">👥 Attendees: {req.expectedAttendees}</p>
            <p className="text-sm">🎯 Purpose: {req.purpose}</p>

            <div className="rounded border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3">
              <div className="flex items-center gap-1 mb-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Generated Letter
              </div>
              <pre className="whitespace-pre-wrap text-xs text-[hsl(var(--foreground))] bg-[hsl(var(--background))] p-2 rounded">
                {req.generatedLetter}
              </pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}