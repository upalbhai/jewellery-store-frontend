import React from 'react';

const StylishLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
      {/* Animated dots */}
      <div className="flex space-x-2">
        <div className="w-4 h-4 rounded-full bg-sea-green animate-bounce" />
        <div className="w-4 h-4 rounded-full bg-[var(--color-sea-green)] animate-bounce delay-150" />
        <div className="w-4 h-4 rounded-full bg-[var(--color-sea-green)] animate-bounce delay-300" />
      </div>

      {/* Progress bar with gradient */}
      <div className="w-48 h-2 rounded-full bg-[var(--color-mint-cream)] overflow-hidden">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-light-teal)] to-[var(--color-teal-green)] animate-progress"
          style={{
            animation: 'progress 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Text with subtle animation */}
      <p className="text-lg font-medium text-[var(--color-deep-green)] animate-pulse">
        Loading Products...
      </p>

      {/* Optional: Circular loader alternative */}
      <div className="relative w-16 h-16 hidden">
        <div className="absolute w-full h-full border-4 border-transparent rounded-full animate-spin border-t-[var(--color-sea-green)] border-r-[var(--color-light-teal)]" />
        <div className="absolute w-full h-full border-4 border-transparent rounded-full animate-spin-reverse border-b-[var(--color-teal-green)] border-l-[var(--color-pale-teal)]" />
      </div>

      {/* CSS for animations - add to your global CSS */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes progress {
          0% { width: 0%; margin-left: 0; }
          50% { width: 100%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StylishLoader;