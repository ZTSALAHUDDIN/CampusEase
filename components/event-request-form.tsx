"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { submitEventRequest, generateEventLetter } from "@/app/actions"
import { Sparkles } from "lucide-react"

interface EventRequestFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventRequestForm({ open, onOpenChange }: EventRequestFormProps) {
  const { userData } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [generatingLetter, setGeneratingLetter] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")

  const handleGenerateLetter = async () => {
    const form = document.getElementById("event-form") as HTMLFormElement
    const formData = new FormData(form)

    const eventName = formData.get("eventName") as string
    const date = formData.get("date") as string
    const venue = formData.get("venue") as string
    const purpose = formData.get("purpose") as string

    if (!eventName || !date || !venue || !purpose) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before generating the letter.",
        variant: "destructive",
      })
      return
    }

    setGeneratingLetter(true)
    try {
      const letter = await generateEventLetter({
        eventName,
        date,
        venue,
        purpose,
        studentName: userData?.name,
      })
      setGeneratedLetter(letter)
      toast({
        title: "Letter generated!",
        description: "Your formal letter has been generated using AI.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate letter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGeneratingLetter(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("generatedLetter", generatedLetter)

    try {
      await submitEventRequest(formData)
      toast({
        title: "Request submitted!",
        description: "Your event permission request has been submitted successfully.",
      })
      onOpenChange(false)
      ;(e.target as HTMLFormElement).reset()
      setGeneratedLetter("")
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Request Event Permission</DialogTitle>
          <DialogDescription>
            Submit your event details and generate a formal permission letter.
          </DialogDescription>
        </DialogHeader>
        <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="userId" value={userData?.uid} />
          <input type="hidden" name="userEmail" value={userData?.email} />

          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name</Label>
            <Input id="eventName" name="eventName" placeholder="e.g., Annual Tech Fest" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Event Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Event Time</Label>
              <Input id="time" name="time" type="time" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" placeholder="e.g., Main Auditorium" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose / Description</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Describe the purpose and details of your event..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedAttendees">Expected Attendees</Label>
            <Input
              id="expectedAttendees"
              name="expectedAttendees"
              type="number"
              placeholder="e.g., 100"
              required
            />
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateLetter}
              disabled={generatingLetter}
              className="flex items-center gap-2 border-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--background))]"
            >
              <Sparkles className="h-4 w-4" />
              {generatingLetter ? "Generating..." : "Generate AI Letter"}
            </Button>
          </div>

          {generatedLetter && (
            <div className="space-y-2">
              <Label>Generated Letter</Label>
              <div className="p-4 rounded-lg border text-sm bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
                <pre className="whitespace-pre-wrap">{generatedLetter}</pre>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}