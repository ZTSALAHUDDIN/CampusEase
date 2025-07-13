"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chatWithGemini } from "@/app/actions"
import { Send, Bot, User } from "lucide-react"

interface ChatBotProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatBot({ open, onOpenChange }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your campus assistant. I can help you with questions about submitting requests, campus procedures, deadlines, and general information. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await chatWithGemini(input)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[hsl(var(--primary))]" />
            Campus AI Assistant
          </DialogTitle>
          <DialogDescription>Ask me anything about campus procedures and services.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-2" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-[hsl(var(--foreground))]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
                    message.sender === "user"
                      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-tr-none"
                      : "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-tl-none"
                  }`}
                >
                  {message.content}
                </div>
                {message.sender === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-[hsl(var(--foreground))]" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-[hsl(var(--foreground))]" />
                </div>
                <div className="bg-[hsl(var(--card))] p-3 rounded-xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t border-[hsl(var(--border))]">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            className="bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}