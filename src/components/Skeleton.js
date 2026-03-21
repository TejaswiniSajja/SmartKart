import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-dark-700 rounded-2xl border border-blue-500/10 overflow-hidden">
      <div className="h-52 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-2/3 skeleton" />
        <div className="flex justify-between items-end pt-2">
          <div className="h-6 w-20 skeleton" />
          <div className="h-9 w-9 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="h-96 skeleton rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 w-24 skeleton" />
          <div className="h-8 w-3/4 skeleton" />
          <div className="h-4 w-1/3 skeleton" />
          <div className="h-20 w-full skeleton" />
          <div className="h-12 w-40 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
