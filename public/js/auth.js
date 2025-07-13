// Authentication functionality
document.addEventListener("DOMContentLoaded", () => {
  const authSection = document.getElementById("auth-section")
  const dashboard = document.getElementById("dashboard")
  const loginTab = document.getElementById("login-tab")
  const registerTab = document.getElementById("register-tab")
  const registerFields = document.getElementById("register-fields")
  const authForm = document.getElementById("auth-form")
  const authBtnText = document.getElementById("auth-btn-text")
  const logoutBtn = document.getElementById("logout-btn")
  const userEmail = document.getElementById("user-email")

  let isLoginMode = true
  const auth = window.firebase.auth() // Declare auth variable
  let currentUser = null // Declare currentUser variable
  let userRole = null // Declare userRole variable
  const loadStudentData = () => {} // Declare loadStudentData variable
  const loadFacultyData = () => {} // Declare loadFacultyData variable

  // Tab switching
  loginTab.addEventListener("click", () => {
    isLoginMode = true
    loginTab.classList.add("bg-blue-600", "text-white")
    loginTab.classList.remove("bg-gray-200", "text-gray-700")
    registerTab.classList.add("bg-gray-200", "text-gray-700")
    registerTab.classList.remove("bg-blue-600", "text-white")
    registerFields.classList.add("hidden")
    authBtnText.textContent = "Login"
  })

  registerTab.addEventListener("click", () => {
    isLoginMode = false
    registerTab.classList.add("bg-blue-600", "text-white")
    registerTab.classList.remove("bg-gray-200", "text-gray-700")
    loginTab.classList.add("bg-gray-200", "text-gray-700")
    loginTab.classList.remove("bg-blue-600", "text-white")
    registerFields.classList.remove("hidden")
    authBtnText.textContent = "Register"
  })

  // Auth form submission
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    try {
      if (isLoginMode) {
        await auth.signInWithEmailAndPassword(email, password)
      } else {
        const name = document.getElementById("name").value
        const role = document.getElementById("role").value
        const department = document.getElementById("department").value

        const userCredential = await auth.createUserWithEmailAndPassword(email, password)

        // Save user profile
        const token = await userCredential.user.getIdToken()
        await fetch("/api/auth/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, role, department }),
        })
      }
    } catch (error) {
      alert("Error: " + error.message)
    }
  })

  // Logout
  logoutBtn.addEventListener("click", () => {
    auth.signOut()
  })

  // Auth state observer
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user
      userEmail.textContent = user.email

      // Get user profile
      const token = await user.getIdToken()
      try {
        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          userRole = userData.role
          showDashboard()
        } else {
          // New user, show registration form
          registerTab.click()
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }

      authSection.classList.add("hidden")
      dashboard.classList.remove("hidden")
    } else {
      currentUser = null
      userRole = null
      authSection.classList.remove("hidden")
      dashboard.classList.add("hidden")
    }
  })
})

function showDashboard() {
  const studentDashboard = document.getElementById("student-dashboard")
  const facultyDashboard = document.getElementById("faculty-dashboard")

  if (userRole === "student") {
    studentDashboard.classList.remove("hidden")
    facultyDashboard.classList.add("hidden")
    loadStudentData() // Ensure loadStudentData is defined
  } else if (userRole === "faculty") {
    facultyDashboard.classList.remove("hidden")
    studentDashboard.classList.add("hidden")
    loadFacultyData() // Ensure loadFacultyData is defined
  }
}

// Define loadStudentData and loadFacultyData functions
function loadStudentData() {
  // Implementation for loading student data
}

function loadFacultyData() {
  // Implementation for loading faculty data
}
