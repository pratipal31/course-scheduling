export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimeSlot {
  day: Day;
  startTime: string;
  endTime: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  isGraduate: boolean;
  requiredCapacity: number;
  instructor: string;
  timePreferences: TimeSlot[];
  duration: number;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  hasProjector: boolean;
}

export interface ScheduleEntry {
  course: Course;
  classroom: Classroom;
  timeSlot: TimeSlot;
}

export interface ConflictReport {
  course: Course;
  reason: string;
}