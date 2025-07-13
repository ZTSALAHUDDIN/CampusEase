const express = require("express")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const { auth } = require("../config/firebase")
const router = express.Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// ✅ Middleware to verify Firebase Auth token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    const decodedToken = await auth.verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid token" })
  }
}

// ✅ Route: Generate Event Permission Letter
router.post("/generate-letter", verifyToken, async (req, res) => {
  try {
    const { eventName, date, venue, purpose } = req.body

    const prompt = `Generate a formal event permission letter for a college event with the following details:
Event Name: ${eventName}
Date: ${date}
Venue: ${venue}
Purpose: ${purpose}

The letter should be addressed to the college administration and should be professional and formal in tone. Include proper formatting with date, subject, and signature placeholders.`

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const letter = response.text()

    res.json({ letter })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ Route: AI Chat Assistant (Dynamic replies using chat.sendMessage)
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create a chat session with initial instruction (no memory yet)
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            "You're CampusEase AI Assistant. Help users with maintenance requests, event permissions, and general college queries. Be concise, friendly, and helpful."
          ]
        }
      ]
    })

    // Send the user's current message
    const result = await chat.sendMessage(message)
    const response = await result.response
    const reply = response.text()

    res.json({ reply })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.error("🔥 Gemini Chat Error:", error)
  }
})

module.exports = router