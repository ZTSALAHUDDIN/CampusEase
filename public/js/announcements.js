// Announcements functionality

// Declare currentUser variable or import it before using
const currentUser = {
  getIdToken: async () => {
    return "dummy-token" // Dummy implementation for illustration
  },
}

async function loadAnnouncements() {
  try {
    const token = await currentUser.getIdToken()
    const response = await fetch("/api/announcements", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const announcements = await response.json()
      displayAnnouncements(announcements)
    }
  } catch (error) {
    console.error("Error loading announcements:", error)
  }
}

function displayAnnouncements(announcements) {
  const container = document.getElementById("announcements")
  container.innerHTML = ""

  if (announcements.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No announcements found.</p>'
    return
  }

  announcements.forEach((announcement) => {
    const announcementElement = document.createElement("div")
    announcementElement.className = "border border-gray-200 rounded-lg p-4"

    announcementElement.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold">${announcement.title}</h4>
                <span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    ${announcement.audience}
                </span>
            </div>
            <p class="text-gray-600 text-sm mb-2">${announcement.message}</p>
            <p class="text-xs text-gray-500">
                Posted: ${new Date(announcement.createdAt.seconds * 1000).toLocaleDateString()}
                by ${announcement.authorEmail}
            </p>
        `

    container.appendChild(announcementElement)
  })
}

function showAnnouncementForm() {
  document.getElementById("announcement-modal").classList.remove("hidden")
}

function hideAnnouncementForm() {
  document.getElementById("announcement-modal").classList.add("hidden")
  document.getElementById("announcement-form").reset()
}

// Announcement form submission
document.getElementById("announcement-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  const title = document.getElementById("announcement-title").value
  const message = document.getElementById("announcement-message").value
  const audience = document.getElementById("announcement-audience").value

  try {
    const token = await currentUser.getIdToken()
    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, message, audience }),
    })

    if (response.ok) {
      alert("Announcement posted successfully!")
      hideAnnouncementForm()
      loadAnnouncements()
    } else {
      alert("Error posting announcement")
    }
  } catch (error) {
    console.error("Error posting announcement:", error)
    alert("Error posting announcement")
  }
})
