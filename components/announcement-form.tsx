"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createAnnouncement } from "@/app/actions"

interface AnnouncementFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnouncementForm({ open, onOpenChange }: AnnouncementFormProps) {
  const { userData } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await createAnnouncement(formData)
      toast({
        title: "Announcement posted!",
        description: "Your announcement has been posted successfully.",
      })
      onOpenChange(false)
      ;(e.target as HTMLFormElement).reset()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create Announcement</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Post an announcement for students and faculty.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input type="hidden" name="authorId" value={userData?.uid} />
          <input type="hidden" name="authorEmail" value={userData?.email} />
          <input type="hidden" name="authorName" value={userData?.name} />

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter announcement title"
              required
              className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Enter your announcement message..."
              required
              className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Audience</Label>
            <Select name="audience" required>
              <SelectTrigger className="bg-[hsl(var(--background))] border border-[hsl(var(--border))]">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="students">Students Only</SelectItem>
                <SelectItem value="faculty">Faculty Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" required>
              <SelectTrigger className="bg-[hsl(var(--background))] border border-[hsl(var(--border))]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Announcement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}