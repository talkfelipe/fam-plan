import { useMemo } from 'react';
import {
  transformEventsForCalendar,
  getEventsForDate,
  dateHasEvents,
  getEventCountForDate,
} from '../utils/calendarHelpers';

/**
 * Custom hook for managing calendar events
 * Provides memoized transformations and filtering utilities
 */
export const useCalendarEvents = (events) => {
  // Transform API events to calendar format (memoized)
  const calendarEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    return transformEventsForCalendar(events);
  }, [events]);

  // Get events for a specific date
  const getEventsFor = useMemo(
    () => (date) => {
      if (!events || !date) return [];
      return getEventsForDate(events, date);
    },
    [events]
  );

  // Check if a date has events
  const hasEvents = useMemo(
    () => (date) => {
      if (!events || !date) return false;
      return dateHasEvents(events, date);
    },
    [events]
  );

  // Get event count for a date
  const getEventCount = useMemo(
    () => (date) => {
      if (!events || !date) return 0;
      return getEventCountForDate(events, date);
    },
    [events]
  );

  return {
    calendarEvents,
    getEventsFor,
    hasEvents,
    getEventCount,
  };
};
