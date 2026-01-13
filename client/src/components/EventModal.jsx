import { useEffect } from 'react';
import EventForm from './EventForm';

function EventModal({ isOpen, onClose, onEventCreated }) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Close modal if clicking on the overlay (not the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSuccess = () => {
    onEventCreated();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Event</h2>
          <button type="button" className="close-button" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <EventForm onSuccess={handleSuccess} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}

export default EventModal;
