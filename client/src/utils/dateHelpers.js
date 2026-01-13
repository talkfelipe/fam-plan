// Format Date object to YYYY-MM-DD for date input
export const formatDateForInput = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format Date object to HH:MM for time input
export const formatTimeForInput = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Round time to nearest 15 minutes
export const roundToNearest15 = (date = new Date()) => {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  const newDate = new Date(date);
  newDate.setMinutes(roundedMinutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

// Get default start time (current time rounded to nearest 15 min)
export const getDefaultStartTime = () => {
  return roundToNearest15(new Date());
};

// Get default end time (1 hour after start time)
export const getDefaultEndTime = (startDate = new Date()) => {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  return endDate;
};

// Combine date and time strings into ISO 8601 format for API
export const combineDateTime = (dateString, timeString) => {
  if (!dateString) return null;

  // If no time provided, use midnight
  const time = timeString || '00:00';
  return `${dateString}T${time}:00`;
};

// Get default form values
export const getDefaultFormValues = () => {
  const startTime = getDefaultStartTime();
  const endTime = getDefaultEndTime(startTime);

  return {
    title: '',
    description: '',
    start_date: formatDateForInput(startTime),
    start_time: formatTimeForInput(startTime),
    end_date: formatDateForInput(endTime),
    end_time: formatTimeForInput(endTime),
    all_day: false,
    event_type: 'other',
  };
};

// Get default form values for a specific date
export const getDefaultFormValuesForDate = (date) => {
  // Create a new Date at the specified date with current time
  const targetDate = new Date(date);
  const now = new Date();

  // Set the time to current time on the target date
  targetDate.setHours(now.getHours(), now.getMinutes(), 0, 0);

  // Round to nearest 15 minutes
  const startTime = roundToNearest15(targetDate);
  const endTime = getDefaultEndTime(startTime);

  return {
    title: '',
    description: '',
    start_date: formatDateForInput(startTime),
    start_time: formatTimeForInput(startTime),
    end_date: formatDateForInput(endTime),
    end_time: formatTimeForInput(endTime),
    all_day: false,
    event_type: 'other',
  };
};
