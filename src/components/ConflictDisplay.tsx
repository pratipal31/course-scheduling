import React from 'react';
import { ConflictReport } from '../lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ConflictDisplayProps {
  conflicts: ConflictReport[];
}

export const ConflictDisplay: React.FC<ConflictDisplayProps> = ({ conflicts }) => {
  const groupedConflicts = conflicts.reduce((acc, conflict) => {
    const type = conflict.reason.includes('capacity') 
      ? 'capacity' 
      : conflict.reason.includes('graduate') 
        ? 'graduate' 
        : 'time';
    
    if (!acc[type]) acc[type] = [];
    acc[type].push(conflict);
    return acc;
  }, {} as Record<string, ConflictReport[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Scheduling Conflicts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {conflicts.length === 0 ? (
          <p className="text-green-600">No scheduling conflicts found.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedConflicts).map(([type, conflicts]) => (
              <div key={type}>
                <h3 className="text-lg font-medium mb-2 capitalize">
                  {type} Conflicts
                </h3>
                <div className="space-y-2">
                  {conflicts.map((conflict, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTitle>
                        {conflict.course.code} - {conflict.course.name}
                      </AlertTitle>
                      <AlertDescription>{conflict.reason}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};