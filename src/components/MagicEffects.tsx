
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

const MagicEffects = () => {
  const [motes, setMotes] = useState<any[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleId = useRef(0);

  useEffect(() => {
    // Generate ambient motes
    const newMotes = Array.from({ length: 25 }).map((_, i) => {
      const size = Math.random() * 4 + 2; // 2px to 6px
      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          animationDuration: `${Math.random() * 15 + 10}s`, // 10-25s
          animationDelay: `${Math.random() * 15}s`,
        },
      };
    });
    setMotes(newMotes);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Create a new sparkle
    const newSparkle = {
      id: sparkleId.current++,
      x: e.clientX,
      y: e.clientY,
    };
    
    setSparkles((prev) => [...prev, newSparkle]);

    // Remove the sparkle after its animation is done
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1000); // Should match CSS animation duration
  }, []);

  useEffect(() => {
    // Throttle function to limit how often the mousemove event fires
    const throttle = (func: (e: MouseEvent) => void, limit: number) => {
      let inThrottle: boolean;
      return function (this: any, event: MouseEvent) {
        if (!inThrottle) {
          func.call(this, event);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const throttledMouseMove = throttle(handleMouseMove, 75);
    window.addEventListener('mousemove', throttledMouseMove);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        {motes.map((mote) => (
          <div key={mote.id} className="mote" style={mote.style} />
        ))}
      </div>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{ top: `${sparkle.y}px`, left: `${sparkle.x}px` }}
        />
      ))}
    </>
  );
};

export default MagicEffects;
