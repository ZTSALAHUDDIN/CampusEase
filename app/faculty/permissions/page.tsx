// app/faculty/permissions/page.tsx
import { EventPermissionsList } from "@/components/EventPermissionsList"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function FacultyPermissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 py-6 md:px-10 max-w-screen-xl mx-auto">
      <Card className="mb-6 shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">📄 Permissions Requested</CardTitle>
          <CardDescription>Student-submitted event permission letters</CardDescription>
        </CardHeader>
        <CardContent>
          <EventPermissionsList />
        </CardContent>
      </Card>
    </div>
  )
}