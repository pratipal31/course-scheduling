// app/page.tsx
'use client';

import React, { useState } from 'react';
import { CourseScheduler, Course, Classroom, ScheduleEntry, ConflictReport } from '../lib/scheduler';
import { CourseForm } from '@/components/CourseForm';
import { ClassroomForm } from '@/components/ClassroomForm';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [conflicts, setConflicts] = useState<ConflictReport[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddCourse = (course: Course) => {
    setCourses([...courses, { ...course, id: `course-${courses.length + 1}` }]);
  };

  const handleAddClassroom = (classroom: Classroom) => {
    setClassrooms([...classrooms, { ...classroom, id: `room-${classrooms.length + 1}` }]);
  };

  const generateSchedule = () => {
    if (courses.length === 0 || classrooms.length === 0) {
      setErrors(['Please add at least one course and one classroom before generating schedule']);
      return;
    }

    const scheduler = new CourseScheduler(courses, classrooms);
    const validationErrors = scheduler.validateInput();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = scheduler.generateSchedule();
    setSchedule(result.schedule);
    setConflicts(result.conflicts);
    setErrors([]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Course Scheduling System</h1>
      
      <Tabs defaultValue="input" className="space-y-6">
        <TabsList>
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="schedule">View Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CourseForm onAddCourse={handleAddCourse} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Added Courses ({courses.length})</h3>
                <ul className="space-y-2">
                  {courses.map((course) => (
                    <li key={course.id} className="p-2 bg-gray-50 rounded">
                      {course.code} - {course.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <ClassroomForm onAddClassroom={handleAddClassroom} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Added Classrooms ({classrooms.length})</h3>
                <ul className="space-y-2">
                  {classrooms.map((classroom) => (
                    <li key={classroom.id} className="p-2 bg-gray-50 rounded">
                      {classroom.name} (Capacity: {classroom.capacity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={generateSchedule}
              className="w-full md:w-auto"
              size="lg"
            >
              Generate Schedule
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          {errors.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Time</th>
                        <th className="border p-2">Course</th>
                        <th className="border p-2">Room</th>
                        <th className="border p-2">Instructor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border p-2">
                            {entry.timeSlot.day} {entry.timeSlot.startTime}-{entry.timeSlot.endTime}
                          </td>
                          <td className="border p-2">
                            {entry.course.code} - {entry.course.name}
                          </td>
                          <td className="border p-2">{entry.classroom.name}</td>
                          <td className="border p-2">{entry.course.instructor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Scheduling Conflicts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {conflicts.length === 0 ? (
                  <p className="text-green-600">No scheduling conflicts found.</p>
                ) : (
                  <ul className="space-y-2">
                    {conflicts.map((conflict, index) => (
                      <li key={index} className="bg-red-50 p-3 rounded">
                        <p className="font-medium">
                          {conflict.course.code} - {conflict.course.name}
                        </p>
                        <p className="text-red-600">{conflict.reason}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}