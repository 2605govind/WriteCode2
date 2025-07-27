import React, { useState, useRef } from 'react';

export default function EditorialTab({ problem }) {
  const [playbackRates] = useState([0.5, 0.75, 1, 1.25, 1.5, 2]);
  const videoRefs = useRef([]);

  const handlePlaybackRateChange = (index, rate) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].playbackRate = rate;
    }
  };

  if (!problem?.videosUrl || problem.videosUrl.length === 0) {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Editorial</h2>
        <div className="whitespace-pre-wrap text-sm leading-relaxed dark:text-gray-300">
          No editorial videos available for this problem.
        </div>
      </div>
    );
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Editorial</h2>
      
      <div className="space-y-8">
        {problem.videosUrl.map((url, index) => {
          const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1] || '';
          
          return (
            <div key={index} className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:shadow-none">
              <div className="bg-gray-50 dark:bg-[#1e1e1e] p-4">
                <h3 className="font-medium dark:text-gray-300">
                  {index === 0 ? "Brute Force Approach" : "Optimized Solution"}
                </h3>
              </div>
              
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  ref={el => videoRefs.current[index] = el}
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                  className="w-full h-96"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Editorial Video ${index + 1}`}
                ></iframe>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#1e1e1e] p-3 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium dark:text-gray-300">Playback Speed:</span>
                {playbackRates.map(rate => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(index, rate)}
                    className="px-3 py-1 text-xs bg-white dark:bg-[#2a2a2a] border dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-[#444444] dark:text-gray-300"
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}