// components/ScheduleDisplay.tsx
import React from 'react';
import { ScheduleEntry } from '../lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../constants/timeSlots';

interface ScheduleDisplayProps {
  schedule: ScheduleEntry[];
}

export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule }) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Time</th>
                {DAYS_OF_WEEK.map(day => (
                  <th key={day} className="border p-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map(timeSlot => (
                <tr key={timeSlot.startTime} className="hover:bg-gray-50">
                  <td className="border p-2 whitespace-nowrap">
                    {timeSlot.startTime}-{timeSlot.endTime}
                  </td>
                  {DAYS_OF_WEEK.map(day => {
                    const entry = schedule.find(
                      e => 
                        e.timeSlot.day === day && 
                        e.timeSlot.startTime === timeSlot.startTime
                    );
                    return (
                      <td key={day} className="border p-2">
                        {entry && (
                          <div className="text-sm">
                            <div className="font-medium">{entry.course.code}</div>
                            <div>{entry.classroom.name}</div>
                            <div className="text-gray-600">{entry.course.instructor}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};