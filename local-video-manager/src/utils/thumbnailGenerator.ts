// Utility for generating thumbnails from video files

/**
 * Generates a thumbnail from a video file
 * @param videoUrl URL to the video file
 * @returns A promise that resolves to a data URL of the thumbnail
 */
export const generateThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    // Load metadata first
    video.addEventListener('loadedmetadata', () => {
      // Seek to 25% of the video duration to capture a representative frame
      video.currentTime = video.duration * 0.25;
    });
    
    // Once we've seeked to the right point, capture the frame
    video.addEventListener('seeked', () => {
      // Create a canvas element to draw the video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to a data URL
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
      
      // Clean up resources
      URL.revokeObjectURL(video.src);
      
      resolve(thumbnailUrl);
    });
    
    // Handle errors
    video.addEventListener('error', (e) => {
      URL.revokeObjectURL(video.src);
      reject(new Error(`Error generating thumbnail: ${e.message}`));
    });
    
    // Set source and start loading
    video.src = videoUrl;
    video.load();
  });
};

/**
 * Cache a thumbnail in localStorage
 * @param fileId Unique identifier for the file (path or handle id)
 * @param thumbnailUrl The thumbnail data URL
 */
export const cacheThumbnail = (fileId: string, thumbnailUrl: string): void => {
  try {
    localStorage.setItem(`thumbnail_${fileId}`, thumbnailUrl);
  } catch (error) {
    console.error('Failed to cache thumbnail:', error);
  }
};

/**
 * Get a cached thumbnail from localStorage
 * @param fileId Unique identifier for the file
 * @returns The cached thumbnail URL or null if not found
 */
export const getCachedThumbnail = (fileId: string): string | null => {
  try {
    return localStorage.getItem(`thumbnail_${fileId}`);
  } catch (error) {
    console.error('Failed to get cached thumbnail:', error);
    return null;
  }
};