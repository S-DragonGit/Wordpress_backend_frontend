import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
    EventContentArg,
} from '@fullcalendar/core';
// import { CalendarEvent } from "../types/types";
// import { useState } from "react";
import { calendarEvents } from "../app/list";

// interface CalendarViewProps {
//     events: CalendarEvent[];
// }

const CalendarView = () => {
    // const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);
    // const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    // const [sheetOpen, setSheetOpen] = useState<boolean>(false);


    const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
    const handleClassName = (arg: EventContentArg) => {

        if (arg.event.extendedProps.calendar === "holiday") {
            return "primary-light";
        }
        else if (arg.event.extendedProps.calendar === "business") {
            return "primary";
        } else if (arg.event.extendedProps.calendar === "personal") {
            return "success";
        } else if (arg.event.extendedProps.calendar === "family") {
            return "failed";
        } else if (arg.event.extendedProps.calendar === "etc") {
            return "failed";
        } else if (arg.event.extendedProps.calendar === "meeting") {
            return "warning";
        }
        else {
            return "primary";
        }

    };
    const handleDateClick = () => {
        wait().then(() => (document.body.style.pointerEvents = "auto"));
    };
    const handleEventClick = () => {
        wait().then(() => (document.body.style.pointerEvents = "auto"));
    };

    return (
        <div className="mt-5 text-sm">
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                ]}
                headerToolbar={{
                    left: "prev,next today",
                    // center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={calendarEvents}
                editable={true}
                rerenderDelay={10}
                eventDurationEditable={false}
                selectable={true}
                selectMirror={true}
                droppable={true}
                dayMaxEvents={2}
                weekends={true}
                eventClassNames={handleClassName}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                initialView="dayGridMonth"
            />
        </div>
    )
}

export default CalendarView