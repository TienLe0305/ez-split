import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function ExpenseItemSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="text-right">
            <Skeleton className="h-5 w-20 mb-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ExpenseDetailSkeleton() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-9 w-3/5 md:w-72 mb-2" />
          <Skeleton className="h-5 w-4/5 md:w-96" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-7 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-4">
        <Skeleton className="h-7 w-56 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      
      <div className="grid gap-4">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    </>
  );
}

export function ExpensesDashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <ExpenseItemSkeleton />
      <ExpenseItemSkeleton />
      <ExpenseItemSkeleton />
      <ExpenseItemSkeleton />
    </div>
  );
} 