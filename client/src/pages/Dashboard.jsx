import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import EventModal from '../components/EventModal';

function Dashboard() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

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
  };

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
        ) : events.length === 0 ? (
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
        )}
      </main>

      <EventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}

export default Dashboard;
