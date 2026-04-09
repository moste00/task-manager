// Extracts a JPEG thumbnail blob from a raw video file using native HTML5 Canvas
export function extractVideoThumbnail(file) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        
        let url = URL.createObjectURL(file);
        
        video.onloadeddata = () => {
             // Seek safely to 1 second, or halfway if it's extremely short
            video.currentTime = Math.min(1, video.duration / 2) || 0;
        };
        
        video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                URL.revokeObjectURL(url);
                resolve(blob);
            }, 'image/jpeg', 0.85);
        };
        
        video.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(null);
        };
        
        video.src = url;
    });
}
