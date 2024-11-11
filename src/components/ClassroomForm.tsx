import React, { useState } from 'react';
import { Classroom } from '../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ClassroomFormProps {
  onAddClassroom: (classroom: Classroom) => void;
}

export const ClassroomForm: React.FC<ClassroomFormProps> = ({ onAddClassroom }) => {
  const [classroom, setClassroom] = useState<Partial<Classroom>>({
    hasProjector: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidClassroom(classroom)) {
      onAddClassroom(classroom as Classroom);
      setClassroom({ hasProjector: false });
    }
  };

  const isValidClassroom = (classroom: Partial<Classroom>): boolean => {
    return !!(classroom.name && classroom.capacity && !isNaN(classroom.capacity));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Classroom</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={classroom.name || ''}
              onChange={(e) => setClassroom({ ...classroom, name: e.target.value })}
              placeholder="Room 101"
              required
            />
          </div>

          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={classroom.capacity || ''}
              onChange={(e) =>
                setClassroom({ ...classroom, capacity: parseInt(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasProjector"
              checked={classroom.hasProjector}
              onChange={(e) => 
                setClassroom({ ...classroom, hasProjector: (e.target as HTMLInputElement).checked })
              }
            />
            <Label htmlFor="hasProjector">Has Projector</Label>
          </div>

          <Button type="submit">Add Classroom</Button>
        </form>
      </CardContent>
    </Card>
  );
};
