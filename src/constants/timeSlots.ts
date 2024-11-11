import { Day, TimeSlot } from '../lib/types';

export const DAYS_OF_WEEK: Day[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

export const TIME_SLOTS: Omit<TimeSlot, 'day'>[] = [
  { startTime: '08:00', endTime: '09:30' },
  { startTime: '09:45', endTime: '11:15' },
  { startTime: '11:30', endTime: '13:00' },
  { startTime: '13:15', endTime: '14:45' },
  { startTime: '15:00', endTime: '16:30' },
  { startTime: '16:45', endTime: '18:15' }
];

// Helper function to check if a time is within business hours
export const isBusinessHours = (time: string): boolean => {
  const hours = parseInt(time.split(':')[0]);
  return hours >= 8 && hours < 19;
};

// Helper function to create a formatted time string
export const formatTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Generate available time slots for a given duration
export const generateTimeSlots = (duration: number): Omit<TimeSlot, 'day'>[] => {
  const slots: Omit<TimeSlot, 'day'>[] = [];
  let currentHour = 8;
  let currentMinute = 0;

  while (currentHour < 19) {
    const startTime = formatTime(currentHour, currentMinute);
    
    // Calculate end time based on duration
    let endHour = currentHour;
    let endMinute = currentMinute + (duration * 60);
    
    while (endMinute >= 60) {
      endHour++;
      endMinute -= 60;
    }
    
    const endTime = formatTime(endHour, endMinute);
    
    if (endHour < 19) {
      slots.push({ startTime, endTime });
    }
    
    // Move to next slot
    currentMinute += 15;
    if (currentMinute >= 60) {
      currentHour++;
      currentMinute = 0;
    }
  }

  return slots;
};