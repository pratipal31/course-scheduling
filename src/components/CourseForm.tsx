import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface Course {
  id?: string;
  code: string;
  name: string;
  instructor: string;
  isGraduate: boolean;
  requiredCapacity: number;
  duration: number;
  timePreferences: TimeSlot[];
}

interface CourseFormProps {
  onAddCourse: (course: Course) => void;
}

export function CourseForm({ onAddCourse }: CourseFormProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { day: 'Monday', startTime: '', endTime: '' }
  ]);

  const [courseData, setCourseData] = useState<Omit<Course, 'id' | 'timePreferences'>>({
    code: '',
    name: '',
    instructor: '',
    isGraduate: false,
    requiredCapacity: 0,
    duration: 0
  });

  const handleTimeSlotChange = (index: number, field: keyof TimeSlot, value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { day: 'Monday', startTime: '', endTime: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!courseData.code.match(/^[A-Z]{2,4}\d{3,4}$/)) {
      alert('Course code must be 2-4 capital letters followed by 3-4 numbers');
      return;
    }

    if (timeSlots.some(slot => !slot.startTime || !slot.endTime)) {
      alert('Please fill in all time slots');
      return;
    }

    const course: Course = {
      ...courseData,
      timePreferences: timeSlots,
      requiredCapacity: Number(courseData.requiredCapacity),
      duration: Number(courseData.duration)
    };

    onAddCourse(course);

    // Reset form
    setCourseData({
      code: '',
      name: '',
      instructor: '',
      isGraduate: false,
      requiredCapacity: 0,
      duration: 0
    });
    setTimeSlots([{ day: 'Monday', startTime: '', endTime: '' }]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                placeholder="CS101"
                value={courseData.code}
                onChange={e => setCourseData({ ...courseData, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                placeholder="Introduction to Programming"
                value={courseData.name}
                onChange={e => setCourseData({ ...courseData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                placeholder="Dr. Smith"
                value={courseData.instructor}
                onChange={e => setCourseData({ ...courseData, instructor: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Required Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={courseData.requiredCapacity || ''}
                onChange={e => setCourseData({ ...courseData, requiredCapacity: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={courseData.duration || ''}
                onChange={e => setCourseData({ ...courseData, duration: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="graduate"
                checked={courseData.isGraduate}
                onCheckedChange={checked => setCourseData({ ...courseData, isGraduate: checked })}
              />
              <Label htmlFor="graduate">Graduate Course</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Time Preferences</h3>
              <Button type="button" variant="outline" onClick={addTimeSlot}>
                Add Time Slot
              </Button>
            </div>

            {timeSlots.map((slot, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Day</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={slot.day}
                    onChange={e => handleTimeSlotChange(index, 'day', e.target.value)}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={e => handleTimeSlotChange(index, 'startTime', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={e => handleTimeSlotChange(index, 'endTime', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">
            Add Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
