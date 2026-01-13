import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import EventModal from '../components/EventModal';
import CalendarView from '../components/calendar/CalendarView';
import DayAgenda from '../components/calendar/DayAgenda';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { getEventsForDate } from '../utils/calendarHelpers';

function Dashboard() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateForNewEvent, setDateForNewEvent] = useState(null);

  // Use calendar events hook
  const { calendarEvents } = useCalendarEvents(events);

  // useEffect runs when component loads (like componentDidMount)
  // The empty array [] means it only runs once when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleEventCreated = async () => {
    await fetchEvents();
    setShowModal(false);
    setDateForNewEvent(null);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleSelectEvent = (event) => {
    // Future: Show event details modal
    console.log('Selected event:', event);
  };

  const handleCreateEventForDate = (date) => {
    setDateForNewEvent(date);
    setShowModal(true);
  };

  // Get events for selected date
  const eventsForSelectedDate = getEventsForDate(events, selectedDate);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Family Calendar</h1>
        <div className="user-info">
          <span>Welcome, {user?.name || 'User'}!</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <>
            <div className="view-controls">
              <div className="view-toggle">
                <button
                  className={view === 'calendar' ? 'active' : ''}
                  onClick={() => setView('calendar')}
                >
                  Calendar View
                </button>
                <button
                  className={view === 'list' ? 'active' : ''}
                  onClick={() => setView('list')}
                >
                  List View
                </button>
              </div>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                + Add Event
              </button>
            </div>

            {view === 'calendar' ? (
              events.length === 0 ? (
                <div className="no-events">
                  <p>No events yet. Create your first event!</p>
                  <button onClick={() => setShowModal(true)}>Add Event</button>
                </div>
              ) : (
                <div className="calendar-container">
                  <CalendarView
                    events={calendarEvents}
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    onSelectEvent={handleSelectEvent}
                  />
                  <DayAgenda
                    selectedDate={selectedDate}
                    events={eventsForSelectedDate}
                    onCreateEvent={handleCreateEventForDate}
                  />
                </div>
              )
            ) : (
              events.length === 0 ? (
                <div className="no-events">
                  <p>No events yet. Create your first event!</p>
                  <button onClick={() => setShowModal(true)}>Add Event</button>
                </div>
              ) : (
                <div className="events-list">
                  <h2>Upcoming Events</h2>
                  {events.map((event) => (
                    <div key={event.id} className="event-card">
                      <h3>{event.title}</h3>
                      {event.description && <p>{event.description}</p>}
                      <div className="event-meta">
                        <span>
                          {new Date(event.start_time).toLocaleDateString()} at{' '}
                          {new Date(event.start_time).toLocaleTimeString()}
                        </span>
                        {event.event_type && (
                          <span className="event-type">{event.event_type}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </main>

      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setDateForNewEvent(null);
        }}
        onEventCreated={handleEventCreated}
        initialDate={dateForNewEvent}
      />
    </div>
  );
}

export default Dashboard;
