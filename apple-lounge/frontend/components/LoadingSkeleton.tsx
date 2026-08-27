'use client';

export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-apple-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-apple-light" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-apple-light rounded w-1/3" />
        <div className="h-4 bg-apple-light rounded w-2/3" />
        <div className="h-3 bg-apple-light rounded w-1/4" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-apple-light rounded w-1/4" />
          <div className="h-9 w-9 bg-apple-light rounded-full" />
        </div>
      </div>
    </div>
  );
}
