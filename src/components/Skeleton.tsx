import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-container-high/40", className)}
      {...props}
    />
  );
}

export function PetCardSkeleton() {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function ApplicationSkeleton() {
  return (
    <div className="bg-surface-container-low rounded-3xl p-5 flex items-center gap-4 border border-outline-variant/10">
      <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
      <div className="flex-grow space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/4 rounded-full" />
        </div>
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
