import React from 'react';
import { Skeleton } from "./ui/skeleton";

const Loading: React.FC = () => {
  return (
    <>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 px-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </>
  );
};

export default Loading;
