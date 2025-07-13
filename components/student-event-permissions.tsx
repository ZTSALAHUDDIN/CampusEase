"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore"
import { useAuth } from "@/components/auth-provider"

interface EventRequest {
  id: string
  eventName: string
  date: string
  time: string
  venue: string
  purpose: string
  expectedAttendees: number
  generatedLetter: string
  status: "pending" | "resolved" | "rejected" | "in-progress"
  createdAt: { seconds: number }
  requestType: "event"
}

export function StudentEventPermissions() {
  const { userData } = useAuth()
  const [requests, setRequests] = useState<EventRequest[]>([])

  useEffect(() => {
    if (!userData?.uid) return

    const q = query(
      collection(db, "eventRequests"),
      where("userId", "==", userData.uid),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.seconds
            ? { seconds: data.createdAt.seconds }
            : null,
        }
      })
      setRequests(events)
    })

    return () => unsubscribe()
  }, [userData?.uid])

  if (requests.length === 0) {
    return <p className="text-sm text-muted-foreground">No event requests found.</p>
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <Card key={req.id} className="shadow-sm">
          <CardContent className="p-6 space-y-3">
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-lg">{req.eventName}</h4>
              <Badge className={getStatusBadgeColor(req.status)}>{req.status}</Badge>
            </div>

            {/* Details */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📅 <span className="text-foreground">{req.date}</span> ⏰ {req.time}</p>
              <p>📍 <span className="text-foreground">{req.venue}</span></p>
              <p>🎯 {req.purpose}</p>
              <p>👥 Expected Attendees: {req.expectedAttendees}</p>
            </div>

            {/* Generated Letter */}
            {req.generatedLetter && (
              <details className="text-sm mt-2 bg-muted p-3 rounded cursor-pointer">
                <summary className="cursor-pointer flex items-center gap-1 font-medium">
                  <FileText className="w-4 h-4" />
                  View Generated Letter
                </summary>
                <pre className="mt-2 whitespace-pre-wrap">{req.generatedLetter}</pre>
              </details>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}