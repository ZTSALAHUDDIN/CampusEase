// Calendar functionality
// Import FullCalendar library
import FullCalendar from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"

function initializeCalendar() {
  const calendarEl = document.getElementById("calendar")

  if (!calendarEl) return

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: [
      {
        title: "Tech Fest 2024",
        start: "2024-02-15",
        color: "#3B82F6",
      },
      {
        title: "Cultural Night",
        start: "2024-02-20",
        color: "#10B981",
      },
      {
        title: "Sports Day",
        start: "2024-02-25",
        color: "#F59E0B",
      },
    ],
    eventClick: (info) => {
      alert("Event: " + info.event.title)
    },
  })

  calendar.render()
}
