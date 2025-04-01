import React from 'react';
import { Card, CardContent } from './ui/card';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
        )}
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
} 