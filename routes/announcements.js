const express = require("express")
const { db, auth } = require("../config/firebase")
const router = express.Router()

// Verify token middleware
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

// Create announcement (faculty only)
router.post("/", verifyToken, async (req, res) => {
  try {
    // Check if user is faculty
    const userDoc = await db.collection("users").doc(req.user.uid).get()
    if (!userDoc.exists || userDoc.data().role !== "faculty") {
      return res.status(403).json({ error: "Access denied" })
    }

    const { title, message, audience } = req.body
    const announcementData = {
      title,
      message,
      audience, // 'all', 'students', 'faculty'
      authorId: req.user.uid,
      authorEmail: req.user.email,
      createdAt: new Date(),
    }

    const docRef = await db.collection("announcements").add(announcementData)
    res.json({ success: true, id: docRef.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get announcements
router.get("/", verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get()
    const userRole = userDoc.data()?.role || "student"

    let query = db.collection("announcements")

    // Filter based on user role
    if (userRole === "student") {
      query = query.where("audience", "in", ["all", "students"])
    } else if (userRole === "faculty") {
      query = query.where("audience", "in", ["all", "faculty"])
    }

    const snapshot = await query.orderBy("createdAt", "desc").get()
    const announcements = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.json(announcements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
