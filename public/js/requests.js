// Request management functionality

// Import Firebase
const firebase = require("firebase/app")
require("firebase/storage")
require("firebase/auth")

// Declare storage and currentUser variables
const storage = firebase.storage() // Assuming Firebase Storage is used
const currentUser = firebase.auth().currentUser // Assuming Firebase Authentication is used

function showMaintenanceForm() {
  document.getElementById("maintenance-modal").classList.remove("hidden")
}

function hideMaintenanceForm() {
  document.getElementById("maintenance-modal").classList.add("hidden")
  document.getElementById("maintenance-form").reset()
}

function showEventForm() {
  document.getElementById("event-modal").classList.remove("hidden")
}

function hideEventForm() {
  document.getElementById("event-modal").classList.add("hidden")
  document.getElementById("event-form").reset()
  document.getElementById("generated-letter").classList.add("hidden")
}

// Declare loadMyRequests function
async function loadMyRequests() {
  // Implementation for loading requests
  console.log("Loading requests...")
}

// Maintenance form submission
document.getElementById("maintenance-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  const type = document.getElementById("maintenance-type").value
  const description = document.getElementById("maintenance-description").value
  const imageFile = document.getElementById("maintenance-image").files[0]

  let imageUrl = null

  // Upload image if provided
  if (imageFile) {
    try {
      const storageRef = storage.ref(`maintenance-images/${Date.now()}_${imageFile.name}`)
      const snapshot = await storageRef.put(imageFile)
      imageUrl = await snapshot.ref.getDownloadURL()
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error uploading image. Request will be submitted without image.")
    }
  }

  try {
    const token = await currentUser.getIdToken()
    const response = await fetch("/api/requests/maintenance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type, description, imageUrl }),
    })

    if (response.ok) {
      alert("Maintenance request submitted successfully!")
      hideMaintenanceForm()
      loadMyRequests()
    } else {
      alert("Error submitting request")
    }
  } catch (error) {
    console.error("Error submitting maintenance request:", error)
    alert("Error submitting request")
  }
})

// Event form submission
document.getElementById("event-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  const eventName = document.getElementById("event-name").value
  const date = document.getElementById("event-date").value
  const venue = document.getElementById("event-venue").value
  const purpose = document.getElementById("event-purpose").value
  const generatedLetter = document.getElementById("letter-content").textContent

  try {
    const token = await currentUser.getIdToken()
    const response = await fetch("/api/requests/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventName, date, venue, purpose, generatedLetter }),
    })

    if (response.ok) {
      alert("Event permission request submitted successfully!")
      hideEventForm()
      loadMyRequests()
    } else {
      alert("Error submitting request")
    }
  } catch (error) {
    console.error("Error submitting event request:", error)
    alert("Error submitting request")
  }
})

async function generateLetter() {
  const eventName = document.getElementById("event-name").value
  const date = document.getElementById("event-date").value
  const venue = document.getElementById("event-venue").value
  const purpose = document.getElementById("event-purpose").value

  if (!eventName || !date || !venue || !purpose) {
    alert("Please fill in all fields before generating the letter.")
    return
  }

  try {
    const token = await currentUser.getIdToken()
    const response = await fetch("/api/gemini/generate-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventName, date, venue, purpose }),
    })

    if (response.ok) {
      const data = await response.json()
      document.getElementById("letter-content").textContent = data.letter
      document.getElementById("generated-letter").classList.remove("hidden")
    } else {
      alert("Error generating letter")
    }
  } catch (error) {
    console.error("Error generating letter:", error)
    alert("Error generating letter")
  }
}
