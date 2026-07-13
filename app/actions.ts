"use server"

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { generateEventLetter as generateLetter, chatWithGemini as chatGemini } from "@/lib/gemini"
import { revalidatePath } from "next/cache"
import { doc, updateDoc } from "firebase/firestore"


//////////////////////////
// 🛠 Submit Maintenance Request
//////////////////////////

export async function submitMaintenanceRequest(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const userEmail = formData.get("userEmail") as string
    const type = formData.get("type") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const priority = formData.get("priority") as string
    const imageFile = formData.get("image") as File | null
    console.log("📝 Submitting Event with userId:", userId)

    let imageUrl = ""

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)
      const fileRef = ref(storage, `maintenance-images/${Date.now()}_${imageFile.name}`)
      await uploadBytes(fileRef, buffer)
      imageUrl = await getDownloadURL(fileRef)
    }

    const requestData = {
      userId,
      userEmail,
      type,
      location,
      description,
      priority,
      imageUrl,
      status: "pending",
      requestType: "maintenance",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await addDoc(collection(db, "maintenanceRequests"), requestData)
    revalidatePath("/")
  } catch (error) {
    console.error("Error submitting maintenance request:", error)
    throw new Error("Failed to submit maintenance request")
  }
}

//////////////////////////
// 🎫 Submit Event Request
//////////////////////////

export async function submitEventRequest(formData: FormData) {
  try {
    const requestData = {
      userId: formData.get("userId") as string,
      userEmail: formData.get("userEmail") as string,
      eventName: formData.get("eventName") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      venue: formData.get("venue") as string,
      purpose: formData.get("purpose") as string,
      expectedAttendees: Number.parseInt(formData.get("expectedAttendees") as string),
      generatedLetter: formData.get("generatedLetter") as string,
      status: "pending",
      requestType: "event",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await addDoc(collection(db, "eventRequests"), requestData)
    revalidatePath("/")
  } catch (error) {
    console.error("Error submitting event request:", error)
    throw new Error("Failed to submit event request")
  }
}

//////////////////////////
// 👤 Get Current User's Requests
//////////////////////////

// app/actions.ts

export async function getMyEventRequests(userId: string) {
  try {
    const q = query(
      collection(db, "eventRequests"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )

    const snap = await getDocs(q)

    return snap.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.seconds
          ? { seconds: data.createdAt.seconds }
          : null,
        updatedAt: data.updatedAt?.seconds
          ? { seconds: data.updatedAt.seconds }
          : null,
      }
    })
  } catch (error) {
    console.error("❌ Error fetching student event requests:", error)
    return []
  }
}
//////////////////////////
// 🧑‍🏫 Get All Requests (Faculty)
//////////////////////////

export async function getAllRequests() {
  try {
    const maintenanceQuery = query(collection(db, "maintenanceRequests"), orderBy("createdAt", "desc"))
    const eventQuery = query(collection(db, "eventRequests"), orderBy("createdAt", "desc"))

    const [maintenanceSnap, eventSnap] = await Promise.all([
      getDocs(maintenanceQuery),
      getDocs(eventQuery)
    ])

    const convertDoc = (doc: any) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.seconds
          ? { seconds: data.createdAt.seconds }
          : null,
        updatedAt: data.updatedAt?.seconds
          ? { seconds: data.updatedAt.seconds }
          : null,
      }
    }

    const maintenanceRequests = maintenanceSnap.docs.map(convertDoc)
    const eventRequests = eventSnap.docs.map(convertDoc)

    return [...maintenanceRequests, ...eventRequests]
  } catch (error) {
    console.error("Error getting all requests:", error)
    return []
  }
}

//////////////////////////
// ✅ Update Request Status
//////////////////////////

export async function updateRequestStatus(
  requestId: string,
  requestType: string,
  status: string,
  comment: string
) {
  try {
    const collectionName = requestType === "event" ? "eventRequests" : "maintenanceRequests"
    const requestRef = doc(db, collectionName, requestId)

    await updateDoc(requestRef, {
      status,
      comment,
      updatedAt: Timestamp.now(),
    })

    console.log(`✅ Updated request ${requestId} (${requestType}) to ${status}`, comment)
    revalidatePath("/")
  } catch (error) {
    console.error("❌ Error updating request status:", error)
    throw new Error("Failed to update request status")
  }
}

//////////////////////////
// 📣 Create Announcement
//////////////////////////

export async function createAnnouncement(formData: FormData) {
  try {
    const announcementData = {
      title: formData.get("title") as string,
      message: formData.get("message") as string,
      audience: formData.get("audience") as string,
      priority: formData.get("priority") as string,
      authorId: formData.get("authorId") as string,
      authorEmail: formData.get("authorEmail") as string,
      authorName: formData.get("authorName") as string,
      createdAt: Timestamp.now(),
    }

    await addDoc(collection(db, "announcements"), announcementData)
    revalidatePath("/")
  } catch (error) {
    console.error("Error creating announcement:", error)
    throw new Error("Failed to create announcement")
  }
}

//////////////////////////
// 📜 Get All Announcements
//////////////////////////
interface Announcement {
  id: string
  title: string
  message: string
  audience: string
  authorId: string
  authorEmail: string
  authorName: string
  priority: string
  createdAt: { seconds: number } | null
}
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    )

    const snap = await getDocs(q)

    return snap.docs.map((doc) => {
      const data = doc.data()

      return {
        id: doc.id,
        title: data.title ?? "",
        message: data.message ?? "",
        audience: data.audience ?? "",
        authorId: data.authorId ?? "",
        authorEmail: data.authorEmail ?? "",
        authorName: data.authorName ?? "",
        priority: data.priority ?? "low",
        createdAt: data.createdAt?.seconds
          ? { seconds: data.createdAt.seconds }
          : null,
      }
    })
  } catch (error) {
    console.error("Error getting announcements:", error)
    return []
  }
}

//////////////////////////
// 🤖 Gemini AI Integrations
//////////////////////////

export async function generateEventLetter(eventDetails: {
  eventName: string
  date: string
  venue: string
  purpose: string
  studentName?: string
}) {
  return await generateLetter(eventDetails)
}


export async function chatWithGemini(message: string): Promise<string> {
  try {
    const res = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If you're using Firebase Auth for auth, pass the token:
        // Authorization: `Bearer ${await getIdToken()}`,
      },
      body: JSON.stringify({ message }),
    })

    if (!res.ok) {
      throw new Error("Gemini API request failed")
    }

    const data = await res.json()
    return data.reply || "I didn't understand that. Please try again."
  } catch (error) {
    console.error("❌ Error calling Gemini backend:", error)
    return "Sorry, I couldn't process your request right now."
  }
}
