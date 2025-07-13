require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/requests", require("./routes/requests"))
app.use("/api/announcements", require("./routes/announcements"))
app.use("/api/gemini", require("./routes/gemini"))

// Serve static files
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
