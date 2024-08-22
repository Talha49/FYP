import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarComponent = ({
  showFullCalendar,
  nestedSheets,
  handleDateClick,
}) => {
  if (!showFullCalendar) {
    return null;
  }

  return (
    <div>
      <FullCalendar
        height={"80vh"}
        plugins={[dayGridPlugin, interactionPlugin]}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={nestedSheets.map((sheet) => ({
          title: sheet.title,
          start: sheet.date,
        }))}
      />
    </div>
  );
};

export default CalendarComponent;
