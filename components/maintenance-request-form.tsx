"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { submitMaintenanceRequest } from "@/app/actions"

interface MaintenanceRequestFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MaintenanceRequestForm({
  open,
  onOpenChange,
}: MaintenanceRequestFormProps) {
  const { userData } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await submitMaintenanceRequest(formData)
      toast({
        title: "Request submitted!",
        description: "Your maintenance request has been submitted successfully.",
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
      <DialogContent
        className="sm:max-w-[500px] bg-card text-card-foreground border border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Submit Maintenance Request
          </DialogTitle>
          <DialogDescription>
            Report any maintenance issues that need attention.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-foreground"
          encType="multipart/form-data"
        >
          <input type="hidden" name="userId" value={userData?.uid} />
          <input type="hidden" name="userEmail" value={userData?.email} />

          <div className="space-y-1">
            <Label htmlFor="type">Issue Type</Label>
            <Select name="type" required>
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., Room 101, Building A"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the issue in detail..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" required>
              <SelectTrigger className="bg-background text-foreground border-border">
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

          {/* <div className="space-y-1">
            <Label htmlFor="image">Upload Image (optional)</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="bg-background text-foreground border-border"
            />
          </div> */}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}