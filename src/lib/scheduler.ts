import { Course, Classroom, ScheduleEntry, ConflictReport, TimeSlot } from './types';

export class CourseScheduler {
  private courses: Course[];
  private classrooms: Classroom[];
  private schedule: ScheduleEntry[];
  private conflicts: ConflictReport[];

  constructor(courses: Course[], classrooms: Classroom[]) {
    this.courses = [...courses];
    this.classrooms = [...classrooms];
    this.schedule = [];
    this.conflicts = [];
  }

  private isTimeSlotAvailable(classroom: Classroom, timeSlot: TimeSlot): boolean {
    return !this.schedule.some(entry => 
      entry.classroom.id === classroom.id &&
      entry.timeSlot.day === timeSlot.day &&
      this.hasTimeOverlap(entry.timeSlot, timeSlot)
    );
  }

  private hasTimeOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private isGraduateConflict(course: Course, timeSlot: TimeSlot): boolean {
    if (!course.isGraduate) return false;

    return this.schedule.some(entry =>
      entry.course.isGraduate &&
      entry.timeSlot.day === timeSlot.day &&
      this.hasTimeOverlap(entry.timeSlot, timeSlot)
    );
  }

  private isInstructorAvailable(course: Course, timeSlot: TimeSlot): boolean {
    return !this.schedule.some(entry =>
      entry.course.instructor === course.instructor &&
      entry.timeSlot.day === timeSlot.day &&
      this.hasTimeOverlap(entry.timeSlot, timeSlot)
    );
  }

  generateSchedule(): { schedule: ScheduleEntry[]; conflicts: ConflictReport[] } {
    this.schedule = [];
    this.conflicts = [];

    const sortedCourses = [...this.courses].sort((a, b) => {
      if (a.isGraduate !== b.isGraduate) return b.isGraduate ? 1 : -1;
      return b.requiredCapacity - a.requiredCapacity;
    });

    for (const course of sortedCourses) {
      let scheduled = false;

      // Try preferred time slots first
      for (const preference of course.timePreferences) {
        for (const classroom of this.classrooms) {
          if (
            classroom.capacity >= course.requiredCapacity &&
            this.isTimeSlotAvailable(classroom, preference) &&
            !this.isGraduateConflict(course, preference) &&
            this.isInstructorAvailable(course, preference)
          ) {
            this.schedule.push({
              course,
              classroom,
              timeSlot: preference,
            });
            scheduled = true;
            break;
          }
        }
        if (scheduled) break;
      }

      if (!scheduled) {
        this.conflicts.push({
          course,
          reason: this.determineConflictReason(course),
        });
      }
    }

    return { 
      schedule: this.schedule.sort((a, b) => 
        this.timeToMinutes(a.timeSlot.startTime) - this.timeToMinutes(b.timeSlot.startTime)
      ), 
      conflicts: this.conflicts 
    };
  }

  private determineConflictReason(course: Course): string {
    if (!this.classrooms.some(room => room.capacity >= course.requiredCapacity)) {
      return `No classroom available with capacity for ${course.requiredCapacity} students`;
    }

    const hasGradConflict = course.timePreferences.every(pref =>
      this.isGraduateConflict(course, pref)
    );
    if (hasGradConflict) {
      return "Conflicts with another graduate course";
    }

    const hasInstructorConflict = course.timePreferences.every(pref =>
      !this.isInstructorAvailable(course, pref)
    );
    if (hasInstructorConflict) {
      return `Instructor ${course.instructor} has conflicting schedules`;
    }

    return "No available time slots matching preferences";
  }

  validateInput(): string[] {
    const errors: string[] = [];

    this.courses.forEach(course => {
      if (!course.code.match(/^[A-Z]{2,4}\d{3,4}$/)) {
        errors.push(`Invalid course code format for ${course.name}`);
      }
      if (course.timePreferences.length === 0) {
        errors.push(`No time preferences specified for ${course.code}`);
      }
      if (course.requiredCapacity <= 0) {
        errors.push(`Invalid capacity requirement for ${course.code}`);
      }
      if (!course.duration || course.duration <= 0) {
        errors.push(`Invalid duration for ${course.code}`);
      }
    });

    this.classrooms.forEach(classroom => {
      if (classroom.capacity <= 0) {
        errors.push(`Invalid capacity for classroom ${classroom.name}`);
      }
    });

    return errors;
  }
}