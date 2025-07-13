"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAllRequests, updateRequestStatus } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Clock, AlertCircle, User } from "lucide-react"

interface Request {
  id: string
  type: string
  status: "pending" | "in-progress" | "resolved" | "rejected"
  createdAt: any
  userEmail: string
  location?: string
  description?: string
  eventName?: string
  venue?: string
  priority?: string
  comment?: string
  requestType: "maintenance" | "event"
}

interface AllRequestsListProps {
  onStatusChange?: () => void
}

export function AllRequestsList({ onStatusChange }: AllRequestsListProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const data = await getAllRequests()
      setRequests(data)
    } catch (error) {
      console.error("Error loading requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, requestType: string, newStatus: string) => {
    const comment = prompt("Add a comment (optional):")

    setUpdatingId(requestId)
    try {
      await updateRequestStatus(requestId, requestType, newStatus, comment || "")
      toast({
        title: "Status updated!",
        description: "Request status has been updated successfully.",
      })
      await loadRequests()
      onStatusChange?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[hsl(54,100%,90%)] text-[hsl(54,100%,30%)]" // light yellow
      case "in-progress":
        return "bg-[hsl(197,97%,90%)] text-[hsl(197,97%,30%)]" // soft blue
      case "resolved":
        return "bg-[hsl(120,40%,85%)] text-[hsl(120,40%,30%)]" // soft green
      case "rejected":
        return "bg-[hsl(0,85%,85%)] text-[hsl(0,85%,30%)]" // soft red
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-[hsl(14,100%,45%)]" // coral
      case "high":
        return "text-[hsl(54,100%,45%)]" // yellow
      case "medium":
        return "text-[hsl(231,30%,50%)]" // desaturated indigo
      case "low":
        return "text-[hsl(120,30%,40%)]" // soft green
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Loading requests...</div>
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-40" />
        <p>No requests found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="bg-[hsl(var(--card))] shadow-sm border border-border">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-[hsl(var(--foreground))]">
                    {request.eventName || `${request.type} Issue`}
                  </h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {request.requestType}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                  <User className="h-3 w-3" />
                  {request.userEmail}
                </p>
                {(request.location || request.venue) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {request.location || request.venue}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {request.priority && <AlertCircle className={`h-4 w-4 ${getPriorityColor(request.priority)}`} />}
                <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                  {request.status.replace("-", " ")}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{request.description}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(request.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
              </div>
              {request.priority && (
                <span className={`capitalize ${getPriorityColor(request.priority)}`}>
                  {request.priority} priority
                </span>
              )}
            </div>

            {request.status === "pending" && (
              <div className="flex gap-2 mb-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(request.id, request.requestType, "in-progress")}
                  disabled={updatingId === request.id}
                >
                  In Progress
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(request.id, request.requestType, "resolved")}
                  disabled={updatingId === request.id}
                  className="bg-[hsl(120,40%,50%)] text-white hover:bg-[hsl(120,40%,45%)]"
                >
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate(request.id, request.requestType, "rejected")}
                  disabled={updatingId === request.id}
                >
                  Reject
                </Button>
              </div>
            )}

            {request.comment && (
              <div className="mt-3 p-2 bg-[hsl(197,97%,95%)] text-[hsl(197,97%,30%)] rounded text-sm">
                <strong>Admin Comment:</strong> {request.comment}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}