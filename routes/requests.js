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

// Submit maintenance request
router.post("/maintenance", verifyToken, async (req, res) => {
  try {
    const { type, description, imageUrl } = req.body
    const requestData = {
      userId: req.user.uid,
      userEmail: req.user.email,
      type,
      description,
      imageUrl: imageUrl || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await db.collection("maintenanceRequests").add(requestData)
    res.json({ success: true, id: docRef.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Submit event permission request
router.post("/event", verifyToken, async (req, res) => {
  try {
    const { eventName, date, venue, purpose, generatedLetter } = req.body
    const requestData = {
      userId: req.user.uid,
      userEmail: req.user.email,
      eventName,
      date,
      venue,
      purpose,
      generatedLetter,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await db.collection("eventRequests").add(requestData)
    res.json({ success: true, id: docRef.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user's requests
router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const maintenanceSnapshot = await db
      .collection("maintenanceRequests")
      .where("userId", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get()

    const eventSnapshot = await db
      .collection("eventRequests")
      .where("userId", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get()

    const maintenanceRequests = maintenanceSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      type: "maintenance",
    }))

    const eventRequests = eventSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      type: "event",
    }))

    res.json([...maintenanceRequests, ...eventRequests])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all requests (faculty only)
router.get("/all", verifyToken, async (req, res) => {
  try {
    // Check if user is faculty
    const userDoc = await db.collection("users").doc(req.user.uid).get()
    if (!userDoc.exists || userDoc.data().role !== "faculty") {
      return res.status(403).json({ error: "Access denied" })
    }

    const maintenanceSnapshot = await db.collection("maintenanceRequests").orderBy("createdAt", "desc").get()

    const eventSnapshot = await db.collection("eventRequests").orderBy("createdAt", "desc").get()

    const maintenanceRequests = maintenanceSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      requestType: "maintenance",
    }))

    const eventRequests = eventSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      requestType: "event",
    }))

    res.json([...maintenanceRequests, ...eventRequests])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update request status (faculty only)
router.put("/:collection/:id/status", verifyToken, async (req, res) => {
  try {
    const { collection, id } = req.params
    const { status, comment } = req.body

    // Check if user is faculty
    const userDoc = await db.collection("users").doc(req.user.uid).get()
    if (!userDoc.exists || userDoc.data().role !== "faculty") {
      return res.status(403).json({ error: "Access denied" })
    }

    const updateData = {
      status,
      updatedAt: new Date(),
      reviewedBy: req.user.uid,
      reviewerEmail: req.user.email,
    }

    if (comment) {
      updateData.comment = comment
    }

    await db.collection(collection).doc(id).update(updateData)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
