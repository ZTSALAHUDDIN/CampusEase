// Chat functionality

let currentUser // Declare the currentUser variable

function showChatBot() {
  document.getElementById("chat-modal").classList.remove("hidden")
}

function hideChatBot() {
  document.getElementById("chat-modal").classList.add("hidden")
}

async function sendChatMessage() {
  const input = document.getElementById("chat-input")
  const message = input.value.trim()

  if (!message) return

  // Add user message to chat
  addChatMessage(message, "user")
  input.value = ""

  try {
    const token = await currentUser.getIdToken()
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    })

    if (response.ok) {
      const data = await response.json()
      addChatMessage(data.reply, "bot")
    } else {
      addChatMessage("Sorry, I encountered an error. Please try again.", "bot")
    }
  } catch (error) {
    console.error("Error sending chat message:", error)
    addChatMessage("Sorry, I encountered an error. Please try again.", "bot")
  }
}

function addChatMessage(message, sender) {
  const messagesContainer = document.getElementById("chat-messages")
  const messageElement = document.createElement("div")

  if (sender === "user") {
    messageElement.className = "bg-blue-600 text-white p-3 rounded-lg ml-8"
  } else {
    messageElement.className = "bg-gray-100 p-3 rounded-lg mr-8"
  }

  messageElement.innerHTML = `<p class="text-sm">${message}</p>`
  messagesContainer.appendChild(messageElement)
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

// Allow Enter key to send message
document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendChatMessage()
  }
})
