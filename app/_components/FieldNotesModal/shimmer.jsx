import React from 'react';

const ShimmerCard = () => (
  <div className="bg-white shadow-md rounded-md p-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="w-full">
        {/* Username shimmer */}
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        {/* Room and date shimmer */}
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      {/* Icon placeholder */}
      <div className="h-4 w-4 bg-gray-200 rounded"></div>
    </div>
    
    {/* Floor shimmer */}
    <div className="h-3 bg-gray-200 rounded w-1/4 mt-4"></div>
    
    {/* Priority badge shimmer */}
    <div className="my-2">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </div>
    
    {/* Image placeholder shimmer */}
    <div className="my-2 h-48 bg-gray-200 rounded-md relative overflow-hidden">
      <div className="shimmer-effect"></div>
    </div>
    
    {/* Tags shimmer */}
    <div className="my-2 flex flex-wrap gap-1">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      <div className="h-6 bg-gray-200 rounded-full w-14"></div>
    </div>
    
    {/* Description shimmer */}
    <div className="my-2 bg-gray-200 rounded-md h-16 relative overflow-hidden">
      <div className="shimmer-effect"></div>
    </div>
    
    {/* Footer info shimmer */}
    <div className="space-y-2 mt-2">
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const ShimmerLoader = ({ expectedCount }) => {
  // Default to 2 cards if expectedCount is not provided or is 0
  const count = expectedCount || 2;
  
  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(count).fill(0).map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </div>
    </>
  );
};

export default ShimmerLoader;