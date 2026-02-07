'use client';

import { useEffect, useState } from 'react';

export default function CustomLoader() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 150); // 150ms for smooth animation (not too fast)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-14 h-14">
      {/* Top */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-6 rounded-full border-2 border-black transition-all duration-150 ${
          activeIndex === 0 ? 'bg-black' : 'bg-white'
        }`}
      ></div>

      {/* Right */}
      <div
        className={`absolute top-1/2 right-0 -translate-y-1/2 w-6 h-3 rounded-full border-2 border-black transition-all duration-150 ${
          activeIndex === 1 ? 'bg-black' : 'bg-white'
        }`}
      ></div>

      {/* Bottom */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-6 rounded-full border-2 border-black transition-all duration-150 ${
          activeIndex === 2 ? 'bg-black' : 'bg-white'
        }`}
      ></div>

      {/* Left */}
      <div
        className={`absolute top-1/2 left-0 -translate-y-1/2 w-6 h-3 rounded-full border-2 border-black transition-all duration-150 ${
          activeIndex === 3 ? 'bg-black' : 'bg-white'
        }`}
      ></div>
    </div>
  );
}
