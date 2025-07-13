"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllRequests } from "@/app/actions"

export function RequestsChart({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    total: 0,
  })

  useEffect(() => {
    loadStats()
  }, [refreshKey])

  const loadStats = async () => {
    try {
      const requests = await getAllRequests()
      const stats = requests.reduce(
        (acc, request) => {
          acc.total++
          switch (request.status) {
            case "pending":
              acc.pending++
              break
            case "in-progress":
              acc.inProgress++
              break
            case "resolved":
              acc.resolved++
              break
            case "rejected":
              acc.rejected++
              break
          }
          return acc
        },
        { pending: 0, inProgress: 0, resolved: 0, rejected: 0, total: 0 }
      )

      setStats(stats)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const getPercentage = (value: number) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
      {/* Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[hsl(43,100%,50%)]">
            {stats.pending}
          </div>
          <p className="text-xs text-muted-foreground">
            {getPercentage(stats.pending)}% of total
          </p>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[hsl(210,100%,55%)]">
            {stats.inProgress}
          </div>
          <p className="text-xs text-muted-foreground">
            {getPercentage(stats.inProgress)}% of total
          </p>
        </CardContent>
      </Card>

      {/* Resolved */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[hsl(140,70%,45%)]">
            {stats.resolved}
          </div>
          <p className="text-xs text-muted-foreground">
            {getPercentage(stats.resolved)}% of total
          </p>
        </CardContent>
      </Card>

      {/* Rejected */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[hsl(0,84%,60%)]">
            {stats.rejected}
          </div>
          <p className="text-xs text-muted-foreground">
            {getPercentage(stats.rejected)}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}