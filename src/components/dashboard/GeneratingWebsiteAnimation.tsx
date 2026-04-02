'use client';

import { useState, useEffect } from 'react';
import CustomLoader from '@/components/CustomLoader';

const generatingMessages = [
  "Analyzing your domain context...",
  "Generating blog titles with AI...",
  "Creating compelling content...",
  "Designing professional images...",
  "Optimizing for search engines...",
  "Building your home page...",
  "Adding responsive styling...",
  "Perfecting the layout...",
];

const finalMessage = "Tidying up and hosting the site...";

export function GeneratingWebsiteAnimation({ progress, isCompleted }: { progress: number; isCompleted: boolean }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setCurrentMessageIndex(-1);
      return;
    }

    const messageInterval = setInterval(() => {
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % generatingMessages.length);
        setIsFlipping(false);
      }, 300);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [isCompleted]);

  const currentMessage = currentMessageIndex === -1
    ? finalMessage
    : generatingMessages[currentMessageIndex];

  return (
    <div className="bg-[#262626]/60 border border-neutral-700 rounded-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0 scale-50">
          <CustomLoader />
        </div>
        <div className="overflow-hidden">
          <div
            className={`w-full transition-all duration-500 ${isFlipping ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
              }`}
          >
            {!isCompleted && (
              <p className="text-xs text-neutral-400">{progress}% {currentMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
