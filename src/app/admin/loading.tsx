import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-xl bg-neutral-200/80 dark:bg-neutral-800/80" />
          <Skeleton className="h-4 w-96 rounded-lg bg-neutral-200/70 dark:bg-neutral-800/70" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-xl bg-neutral-200/80 dark:bg-neutral-800/80" />
          <Skeleton className="h-10 w-36 rounded-xl bg-neutral-200/80 dark:bg-neutral-800/80" />
        </div>
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md bg-neutral-200/80 dark:bg-neutral-800/80" />
              <Skeleton className="h-9 w-9 rounded-xl bg-neutral-200/80 dark:bg-neutral-800/80" />
            </div>
            <Skeleton className="h-10 w-16 rounded-xl bg-neutral-200/80 dark:bg-neutral-800/80" />
            <Skeleton className="h-3 w-36 rounded-md bg-neutral-200/70 dark:bg-neutral-800/70" />
          </div>
        ))}
      </div>

      {/* Grid: Category Distribution & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution Skeleton */}
        <div className="lg:col-span-1 clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-5">
          <div className="space-y-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <Skeleton className="h-6 w-36 rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80" />
            <Skeleton className="h-3 w-48 rounded-md bg-neutral-200/70 dark:bg-neutral-800/70" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28 rounded-md bg-neutral-200/80 dark:bg-neutral-800/80" />
                  <Skeleton className="h-4 w-16 rounded-md bg-neutral-200/70 dark:bg-neutral-800/70" />
                </div>
                <Skeleton className="h-2 w-full rounded-full bg-neutral-200/70 dark:bg-neutral-800/70" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products / Data Table Skeleton */}
        <div className="lg:col-span-2 clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-5">
          <div className="space-y-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <Skeleton className="h-6 w-44 rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80" />
            <Skeleton className="h-3 w-64 rounded-md bg-neutral-200/70 dark:bg-neutral-800/70" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40 rounded-md bg-neutral-200/80 dark:bg-neutral-800/80" />
                    <Skeleton className="h-3 w-24 rounded-md bg-neutral-200/70 dark:bg-neutral-800/70" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-md bg-neutral-200/80 dark:bg-neutral-800/80" />
                <Skeleton className="h-6 w-16 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
