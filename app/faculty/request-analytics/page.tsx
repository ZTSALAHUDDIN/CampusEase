"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllRequests } from "@/app/actions"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { BarChart, Loader2, ArrowLeft } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"

export default function RequestAnalyticsPage() {
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const requests = await getAllRequests()
      const computed = requests.reduce(
        (acc, req) => {
          acc.total++
          switch (req.status) {
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
      setStats(computed)
    } catch (err) {
      console.error("Error loading request stats:", err)
    } finally {
      setLoading(false)
    }
  }

  const getPercentage = (count: number) =>
    stats.total > 0 ? Math.round((count / stats.total) * 100) : 0

  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
    { name: "Rejected", value: stats.rejected },
  ]

  const COLORS = ["#FACC15", "#3B82F6", "#22C55E", "#EF4444"]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        Loading analytics...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* 🔙 Back Button
      <Button
        variant="outline"
        onClick={() => router.push("/faculty")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button> */}

      {/* 🧠 Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart className="text-green-600" />
        <h1 className="text-2xl font-bold">Request Analytics Dashboard</h1>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Pending</CardTitle>
            <CardDescription>{getPercentage(stats.pending)}% of total</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-yellow-600">{stats.pending}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">In Progress</CardTitle>
            <CardDescription>{getPercentage(stats.inProgress)}% of total</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-600">{stats.inProgress}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Resolved</CardTitle>
            <CardDescription>{getPercentage(stats.resolved)}% of total</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">{stats.resolved}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Rejected</CardTitle>
            <CardDescription>{getPercentage(stats.rejected)}% of total</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-600">{stats.rejected}</CardContent>
        </Card>
      </div>

      {/* 📈 Pie Chart */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">📊 Visual Chart</CardTitle>
          <CardDescription>Distribution of all requests</CardDescription>
        </CardHeader>
        <CardContent className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}