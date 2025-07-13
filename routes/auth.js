const express = require("express")
const { auth, db } = require("../config/firebase")
const router = express.Router()

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decodedToken = await auth.verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid token" })
  }
}

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get()
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(userDoc.data())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
router.post("/profile", verifyToken, async (req, res) => {
  try {
    const { role, name, department } = req.body
    const userData = {
      uid: req.user.uid,
      email: req.user.email,
      name,
      role,
      department,
      createdAt: new Date(),
    }

    await db.collection("users").doc(req.user.uid).set(userData, { merge: true })
    res.json({ success: true, user: userData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
