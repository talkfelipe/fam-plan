import { isWithinInterval, isSameDay, startOfDay, endOfDay } from 'date-fns';

/**
 * Transform an event from API format to React Big Calendar format
 */
export const transformEventForCalendar = (event) => {
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: event.end_time ? new Date(event.end_time) : new Date(event.start_time),
    allDay: event.all_day,
    resource: {
      type: event.event_type,
      description: event.description,
      originalEvent: event,
    },
  };
};

/**
 * Transform multiple events from API format to calendar format
 */
export const transformEventsForCalendar = (events) => {
  return events.map(transformEventForCalendar);
};

/**
 * Get all events that occur on a specific date
 */
export const getEventsForDate = (events, date) => {
  if (!date || !events || events.length === 0) {
    return [];
  }

  const targetDate = new Date(date);
  const dayStart = startOfDay(targetDate);
  const dayEnd = endOfDay(targetDate);

  return events.filter((event) => {
    const eventStart = new Date(event.start_time);
    const eventEnd = event.end_time ? new Date(event.end_time) : eventStart;

    // Check if the event overlaps with the target date
    return (
      isWithinInterval(eventStart, { start: dayStart, end: dayEnd }) ||
      isWithinInterval(eventEnd, { start: dayStart, end: dayEnd }) ||
      isWithinInterval(dayStart, { start: eventStart, end: eventEnd })
    );
  });
};

/**
 * Check if a date has any events
 */
export const dateHasEvents = (events, date) => {
  return getEventsForDate(events, date).length > 0;
};

/**
 * Get event count for a specific date
 */
export const getEventCountForDate = (events, date) => {
  return getEventsForDate(events, date).length;
};

/**
 * Get event type color
 */
export const getEventTypeColor = (eventType) => {
  const colors = {
    appointment: '#3b82f6',  // Blue
    reminder: '#f59e0b',     // Amber
    task: '#10b981',         // Green
    birthday: '#ec4899',     // Pink
    other: '#6b7280',        // Gray
  };

  return colors[eventType] || colors.other;
};

/**
 * Get event style for React Big Calendar
 */
export const eventStyleGetter = (event) => {
  const backgroundColor = getEventTypeColor(event.resource?.type);

  return {
    style: {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block',
    },
  };
};
