import React from 'react';
import { format } from 'date-fns';
import './DayAgenda.css';
import { getEventTypeColor } from '../../utils/calendarHelpers';

/**
 * DayAgenda component
 * Displays events for a selected date in a sidebar
 */
const DayAgenda = ({ selectedDate, events, onCreateEvent }) => {
  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => {
    const aStart = new Date(a.start_time);
    const bStart = new Date(b.start_time);
    return aStart - bStart;
  });

  // Separate all-day events from timed events
  const allDayEvents = sortedEvents.filter((event) => event.all_day);
  const timedEvents = sortedEvents.filter((event) => !event.all_day);

  const renderEvent = (event) => {
    const color = getEventTypeColor(event.event_type);
    const startTime = new Date(event.start_time);
    const endTime = event.end_time ? new Date(event.end_time) : null;

    return (
      <div key={event.id} className="day-agenda-event">
        <div
          className="event-indicator"
          style={{ backgroundColor: color }}
        />
        <div className="event-details">
          {!event.all_day && (
            <div className="event-time">
              {format(startTime, 'h:mm a')}
              {endTime && ` - ${format(endTime, 'h:mm a')}`}
            </div>
          )}
          <div className="event-title">{event.title}</div>
          {event.description && (
            <div className="event-description">{event.description}</div>
          )}
          <div className="event-type-badge" style={{ backgroundColor: color }}>
            {event.event_type}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="day-agenda">
      <div className="day-agenda-header">
        <h3>{formattedDate}</h3>
        <button
          className="create-event-btn"
          onClick={() => onCreateEvent(selectedDate)}
        >
          + Create Event
        </button>
      </div>

      <div className="day-agenda-content">
        {events.length === 0 ? (
          <div className="no-events">
            <p>No events scheduled for this day</p>
            <button
              className="create-event-link"
              onClick={() => onCreateEvent(selectedDate)}
            >
              Create your first event
            </button>
          </div>
        ) : (
          <>
            {allDayEvents.length > 0 && (
              <div className="event-section">
                <h4 className="section-title">All Day</h4>
                {allDayEvents.map(renderEvent)}
              </div>
            )}

            {timedEvents.length > 0 && (
              <div className="event-section">
                {allDayEvents.length > 0 && <h4 className="section-title">Scheduled</h4>}
                {timedEvents.map(renderEvent)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DayAgenda;
