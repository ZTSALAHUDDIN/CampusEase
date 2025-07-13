"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function RequestsList() {
  const { userData } = useAuth()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userData?.uid) return

    const q = query(
      collection(db, "maintenanceRequests"),
      where("userId", "==", userData.uid)
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setRequests(results)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userData?.uid])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[hsl(43,100%,85%)] text-[hsl(43,100%,30%)]"
      case "in-progress":
        return "bg-[hsl(210,100%,90%)] text-[hsl(210,100%,40%)]"
      case "resolved":
        return "bg-[hsl(140,60%,90%)] text-[hsl(140,60%,30%)]"
      case "rejected":
        return "bg-[hsl(0,84%,90%)] text-[hsl(0,84%,40%)]"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-[hsl(0,84%,50%)]"
      case "high":
        return "text-[hsl(24,100%,45%)]"
      case "medium":
        return "text-[hsl(43,100%,40%)]"
      case "low":
        return "text-[hsl(140,60%,40%)]"
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading requests...</p>
  }

  if (requests.length === 0) {
    return <p className="text-sm text-muted-foreground">No requests found.</p>
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold capitalize text-[hsl(var(--foreground))]">
                  {request.type} Issue
                </h4>
                {request.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {request.location}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {request.priority && (
                  <AlertCircle className={`h-4 w-4 ${getPriorityColor(request.priority)}`} />
                )}
                <Badge className={getStatusColor(request.status)}>
                  {request.status?.replace("-", " ")}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{request.description}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {request.createdAt?.seconds
                  ? new Date(request.createdAt.seconds * 1000).toLocaleDateString()
                  : "Unknown"}
              </div>
              {request.priority && (
                <span className={`capitalize ${getPriorityColor(request.priority)}`}>
                  {request.priority} priority
                </span>
              )}
            </div>

            {request.comment && (
              <div className="mt-3 p-2 rounded text-sm bg-[hsl(210,100%,95%)] text-[hsl(210,100%,30%)]">
                <strong>Admin Comment:</strong> {request.comment}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}