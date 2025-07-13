import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "demo-key")

export async function generateEventLetter(eventDetails: {
  eventName: string
  date: string
  venue: string
  purpose: string
  studentName?: string
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Generate a formal event permission letter for a college event with the following details:
    
Event Name: ${eventDetails.eventName}
Date: ${eventDetails.date}
Venue: ${eventDetails.venue}
Purpose: ${eventDetails.purpose}
Student Name: ${eventDetails.studentName || "[Student Name]"}

The letter should be addressed to the college administration and should be professional and formal in tone. Include proper formatting with date, subject, and signature placeholders.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating letter:", error)
    return `Dear College Administration,

Subject: Request for Permission to Organize ${eventDetails.eventName}

I am writing to request permission to organize "${eventDetails.eventName}" on ${eventDetails.date} at ${eventDetails.venue}.

Purpose: ${eventDetails.purpose}

We assure you that all college guidelines will be followed during the event. We request your kind approval for the same.

Thank you for your consideration.

Sincerely,
${eventDetails.studentName || "[Student Name]"}
[Student ID]
[Department]
[Date]`
  }
}

export async function chatWithGemini(message: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const contextPrompt = `You are a helpful campus assistant bot for CampusEase, a college management system. 
Answer questions about:
- How to submit maintenance requests
- How to request event permissions
- College procedures and deadlines
- General campus information

Keep responses concise and helpful. If you don't know something specific about the college, suggest contacting the administration.

User question: ${message}`

    const result = await model.generateContent(contextPrompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error with Gemini chat:", error)
    return "I'm sorry, I'm having trouble connecting right now. Please try again later or contact the administration for assistance."
  }
}
