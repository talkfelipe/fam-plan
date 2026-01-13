import { useState } from 'react';
import { eventsAPI } from '../services/api';
import { getDefaultFormValues, getDefaultFormValuesForDate, combineDateTime } from '../utils/dateHelpers';

function EventForm({ onSuccess, onCancel, initialDate }) {
  const [formData, setFormData] = useState(() => {
    if (initialDate) {
      return getDefaultFormValuesForDate(initialDate);
    }
    return getDefaultFormValues();
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title is required
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Start date is required
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    // Start time is required unless all_day is true
    if (!formData.all_day && !formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    // If end date/time provided, validate it's after start
    if (formData.end_date && formData.start_date) {
      const startDateTime = new Date(
        combineDateTime(formData.start_date, formData.all_day ? '00:00' : formData.start_time)
      );
      const endDateTime = new Date(
        combineDateTime(formData.end_date, formData.all_day ? '23:59' : formData.end_time)
      );

      if (endDateTime <= startDateTime) {
        newErrors.end_date = 'End date/time must be after start date/time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        start_time: combineDateTime(
          formData.start_date,
          formData.all_day ? '00:00' : formData.start_time
        ),
        all_day: formData.all_day,
        event_type: formData.event_type,
      };

      // Add end_time if provided
      if (formData.end_date) {
        eventData.end_time = combineDateTime(
          formData.end_date,
          formData.all_day ? '23:59' : formData.end_time
        );
      }

      await eventsAPI.create(eventData);
      onSuccess();
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.join(', ') || 'Failed to create event. Please try again.';
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      {apiError && <div className="error-message">{apiError}</div>}

      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event title"
          autoFocus
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="all_day"
            checked={formData.all_day}
            onChange={handleChange}
          />
          All Day Event
        </label>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="start_date">
            Start Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className={errors.start_date ? 'error' : ''}
          />
          {errors.start_date && <span className="error-text">{errors.start_date}</span>}
        </div>

        {!formData.all_day && (
          <div className="form-group">
            <label htmlFor="start_time">
              Start Time <span className="required">*</span>
            </label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className={errors.start_time ? 'error' : ''}
            />
            {errors.start_time && <span className="error-text">{errors.start_time}</span>}
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className={errors.end_date ? 'error' : ''}
          />
          {errors.end_date && <span className="error-text">{errors.end_date}</span>}
        </div>

        {!formData.all_day && (
          <div className="form-group">
            <label htmlFor="end_time">End Time</label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="event_type">Event Type</label>
        <select id="event_type" name="event_type" value={formData.event_type} onChange={handleChange}>
          <option value="other">Other</option>
          <option value="appointment">Appointment</option>
          <option value="reminder">Reminder</option>
          <option value="task">Task</option>
          <option value="birthday">Birthday</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add event details..."
          rows="4"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}

export default EventForm;
