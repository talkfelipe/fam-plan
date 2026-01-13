import React from 'react';
import { getEventTypeColor } from '../../utils/calendarHelpers';

/**
 * Custom event component for React Big Calendar
 * Displays event with color coding based on event type
 */
const CustomEvent = ({ event }) => {
  const backgroundColor = getEventTypeColor(event.resource?.type);

  return (
    <div
      className="custom-event"
      style={{
        backgroundColor,
        color: 'white',
        padding: '2px 4px',
        borderRadius: '3px',
        fontSize: '0.85rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={event.title}
    >
      <strong>{event.title}</strong>
    </div>
  );
};

export default CustomEvent;
