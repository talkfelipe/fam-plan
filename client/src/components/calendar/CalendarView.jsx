import React, { useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';
import CustomEvent from './CustomEvent';
import { eventStyleGetter } from '../../utils/calendarHelpers';

// Setup the localizer for React Big Calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/**
 * CalendarView component
 * Displays events in a month calendar grid using React Big Calendar
 */
const CalendarView = ({ events, selectedDate, onSelectDate, onSelectEvent }) => {
  // Handle slot (date cell) selection
  const handleSelectSlot = useCallback(
    (slotInfo) => {
      onSelectDate(slotInfo.start);
    },
    [onSelectDate]
  );

  // Handle event selection
  const handleSelectEvent = useCallback(
    (event) => {
      onSelectEvent(event);
    },
    [onSelectEvent]
  );

  // Custom components for React Big Calendar
  const components = {
    event: CustomEvent,
  };

  return (
    <div className="calendar-view">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        popup
        views={['month']}
        defaultView="month"
        eventPropGetter={eventStyleGetter}
        components={components}
        date={selectedDate}
        onNavigate={onSelectDate}
      />
    </div>
  );
};

export default CalendarView;
