
import React, { useState, useEffect } from 'react';

const GoogleLoader = ({ isLoading = false }) => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let progressInterval;
    let fadeTimeout;

    if (isLoading) {
      setOpacity(1);
      // Quick initial progress to 30%
      setProgress(30);

      // Slowly progress to 85%
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 85) {
            return prev + Math.random() * 10;
          }
          clearInterval(progressInterval);
          return prev;
        });
      }, 500);
    } else if (progress > 0) {
      // Complete the progress quickly when loading is done
      setProgress(100);
      
      // Fade out
      fadeTimeout = setTimeout(() => {
        setOpacity(0);
        // Reset progress after fade
        setTimeout(() => setProgress(0), 200);
      }, 200);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimeout);
    };
  }, [isLoading]);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-1 z-50"
      style={{ opacity }}
    >
      <div 
        className="h-full bg-blue-500 transition-all duration-200 ease-out"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)'
        }}
      />
    </div>
  );
};

export default GoogleLoader;
