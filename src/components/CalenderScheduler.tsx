import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "Video Conference",
    start: new Date(2025, 0, 22, 9, 30), // Jan 22, 9:30 AM
    end: new Date(2025, 0, 22, 11, 30), // Jan 22, 11:30 AM
    allDay: false,
    color: "#f56969", // Custom color for this event
  },
  {
    title: "Doctor's Appointment",
    start: new Date(2025, 0, 26, 13, 15), // Jan 26, 1:15 PM
    end: new Date(2025, 0, 26, 14, 15), // Jan 26, 2:15 PM
    allDay: false,
    color: "#4caf50", // Custom color for this event
  },
  {
    title: "Take Dog to the Vet",
    start: new Date(2025, 0, 25, 8, 0), // Jan 25, 8:00 AM
    end: new Date(2025, 0, 25, 9, 0), // Jan 25, 9:00 AM
    allDay: false,
    color: "#2196f3", // Custom color for this event
  },
];

// Custom Event Renderer
const eventStyleGetter = (event: { color: any; }) => {
  const style = {
    backgroundColor: event.color || "#757575", // Use event-specific color or default
    color: "white", // Event text color
    borderRadius: "5px",
    border: "none",
    display: "block",
    padding: "5px",
  };
  return { style };
};

const Event = ({ event }: { event: { title: string; start: Date; end: Date; color: string } }) => {
  // Format time using moment
  const startTime = moment(event.start).format("h:mm A");
  const endTime = moment(event.end).format("h:mm A");
  return (
    <span>
      <strong>{event.title}</strong>
      <br />
      {startTime} - {endTime}
    </span>
  );
};

const CalendarScheduler = () => {
  return (
    <div className="calendar-container" style={{ height: "80vh", margin: "20px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        defaultView="month" // Changed to week view for better event details
        components={{
          event: Event, // Use the custom event renderer
        }}
        eventPropGetter={eventStyleGetter} // Add custom styles to events
      />
    </div>
  );
};

export default CalendarScheduler;
