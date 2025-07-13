import { Chart } from "@/components/ui/chart"
import { currentUser } from "@/auth"
import { loadAnnouncements, initializeCalendar } from "@/utils/dashboard"

// Dashboard functionality
async function loadStudentData() {
  await loadMyRequests()
  await loadAnnouncements()
  initializeCalendar()
}

async function loadFacultyData() {
  await loadAllRequests()
  await loadAnnouncements()
  loadAnalytics()
}

async function loadMyRequests() {
  try {
    const token = await currentUser.getIdToken()
    const response = await fetch("/api/requests/my-requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const requests = await response.json()
      displayMyRequests(requests)
    }
  } catch (error) {
    console.error("Error loading requests:", error)
  }
}

async function loadAllRequests() {
  try {
    const token = await currentUser.getIdToken()
    const response = await fetch("/api/requests/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const requests = await response.json()
      displayAllRequests(requests)
    }
  } catch (error) {
    console.error("Error loading all requests:", error)
  }
}

function displayMyRequests(requests) {
  const container = document.getElementById("my-requests")
  container.innerHTML = ""

  if (requests.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No requests found.</p>'
    return
  }

  requests.forEach((request) => {
    const requestElement = document.createElement("div")
    requestElement.className = "border border-gray-200 rounded-lg p-4"

    const statusColor = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }

    requestElement.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold">${request.type === "maintenance" ? request.type : request.eventName}</h4>
                <span class="px-2 py-1 rounded-full text-xs ${statusColor[request.status] || "bg-gray-100 text-gray-800"}">
                    ${request.status}
                </span>
            </div>
            <p class="text-gray-600 text-sm mb-2">${request.description || request.purpose}</p>
            <p class="text-xs text-gray-500">
                Submitted: ${new Date(request.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
            ${request.comment ? `<p class="text-xs text-blue-600 mt-1">Comment: ${request.comment}</p>` : ""}
        `

    container.appendChild(requestElement)
  })
}

function displayAllRequests(requests) {
  const container = document.getElementById("all-requests")
  container.innerHTML = ""

  if (requests.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No requests found.</p>'
    return
  }

  requests.forEach((request) => {
    const requestElement = document.createElement("div")
    requestElement.className = "border border-gray-200 rounded-lg p-4"

    const statusColor = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }

    requestElement.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="font-semibold">${request.requestType === "maintenance" ? request.type : request.eventName}</h4>
                    <p class="text-sm text-gray-600">By: ${request.userEmail}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs ${statusColor[request.status] || "bg-gray-100 text-gray-800"}">
                    ${request.status}
                </span>
            </div>
            <p class="text-gray-600 text-sm mb-2">${request.description || request.purpose}</p>
            <p class="text-xs text-gray-500 mb-2">
                Submitted: ${new Date(request.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
            <div class="flex space-x-2">
                <button onclick="updateRequestStatus('${request.requestType === "maintenance" ? "maintenanceRequests" : "eventRequests"}', '${request.id}', 'in-progress')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                    In Progress
                </button>
                <button onclick="updateRequestStatus('${request.requestType === "maintenance" ? "maintenanceRequests" : "eventRequests"}', '${request.id}', 'resolved')" 
                        class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                    Resolve
                </button>
                <button onclick="updateRequestStatus('${request.requestType === "maintenance" ? "maintenanceRequests" : "eventRequests"}', '${request.id}', 'rejected')" 
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
                    Reject
                </button>
            </div>
        `

    container.appendChild(requestElement)
  })
}

async function updateRequestStatus(collection, id, status) {
  try {
    const comment = prompt("Add a comment (optional):")
    const token = await currentUser.getIdToken()

    const response = await fetch(`/api/requests/${collection}/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, comment }),
    })

    if (response.ok) {
      alert("Request status updated successfully!")
      loadAllRequests()
    } else {
      alert("Error updating request status")
    }
  } catch (error) {
    console.error("Error updating request status:", error)
    alert("Error updating request status")
  }
}

function loadAnalytics() {
  // Simple analytics chart
  const ctx = document.getElementById("analytics-chart").getContext("2d")
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Pending", "In Progress", "Resolved", "Rejected"],
      datasets: [
        {
          data: [12, 8, 25, 3],
          backgroundColor: ["#FEF3C7", "#DBEAFE", "#D1FAE5", "#FEE2E2"],
          borderColor: ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })
}
