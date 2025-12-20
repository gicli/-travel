import React from 'react';
import { Plane } from 'lucide-react';

export const Loading: React.FC<{ message?: string }> = ({ message = "여행을 큐레이팅 중입니다..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-primary/60">
      <div className="relative mb-4">
        <div className="absolute inset-0 animate-ping rounded-full bg-secondary/20"></div>
        <Plane className="w-12 h-12 animate-bounce text-secondary relative z-10" />
      </div>
      <p className="font-serif text-lg animate-pulse">{message}</p>
    </div>
  );
};