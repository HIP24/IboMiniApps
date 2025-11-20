import { useState } from 'react';

const YoutubeDownloader = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formats, setFormats] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [downloadedFile, setDownloadedFile] = useState('');
  const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const getFormats = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setMessage('Getting available formats...');
    
    try {
      const response = await fetch('http://localhost:3001/formats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      if (response.ok && !data.error) {
        setFormats(data.formats || []);
        setVideoInfo(data);
        setMessage('');
      } else {
        setMessage(`Error: ${data.error || 'Failed to get formats'}`);
      }
    } catch (error) {
      setMessage('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVideo = async () => {
    setIsLoading(true);
    setIsDownloading(true);
    setProgress(0);
    setMessage('Starting video download...');
    setDownloadedFile('');
    const downloadId = Date.now().toString();
    setCurrentDownloadId(downloadId);

    // Request notification permission and show start notification
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        new Notification('🎬 Download Started', {
          body: `Video download started: ${videoInfo?.title || 'YouTube Video'}`,
          tag: 'youtube-download',
          requireInteraction: false
        });
      }
    }

    try {
      // Start download request
      const downloadPromise = fetch('http://localhost:3001/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          downloadAudio: false,
          downloadVideo: true,
          quality: selectedQuality,
          downloadId,
        }),
      });

      // Start progress tracking
      const progressInterval = setInterval(async () => {
        try {
          const progressResponse = await fetch(`http://localhost:3001/progress/${downloadId}`);
          const progressData = await progressResponse.json();
          if (progressData.progress !== undefined && progressData.progress >= 0) {
            setProgress(progressData.progress);
          }
        } catch (e) {
          // Continue with current progress
        }
      }, 500);

      const response = await downloadPromise;
      clearInterval(progressInterval);
      
      const data = await response.json();
      if (response.ok) {
        setMessage('Video downloaded to Downloads folder!');
        setDownloadedFile('video');
        
        // Show completion notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('✅ Download Complete!', {
            body: `Video saved to Downloads folder: ${videoInfo?.title || 'YouTube Video'}`,
            tag: 'youtube-complete',
            requireInteraction: true
          });
        }
      } else {
        setMessage(`Error: ${data.error || 'Failed to download'}`);
      }
    } catch (error) {
      setMessage('Failed to connect to server');
    } finally {
      setCurrentDownloadId(null);
      setIsLoading(false);
      setIsDownloading(false);
    }
  };

  const downloadAudio = async () => {
    setIsLoading(true);
    setIsDownloading(true);
    setProgress(0);
    setMessage('Starting audio download...');
    setDownloadedFile('');
    const downloadId = Date.now().toString();
    setCurrentDownloadId(downloadId);

    // Request notification permission and show start notification
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        new Notification('🎵 Download Started', {
          body: `Audio download started: ${videoInfo?.title || 'YouTube Audio'}`,
          tag: 'youtube-download',
          requireInteraction: false
        });
      }
    }

    try {
      // Start download request
      const downloadPromise = fetch('http://localhost:3001/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          downloadAudio: true,
          downloadVideo: false,
          downloadId,
        }),
      });

      // Start progress tracking
      const progressInterval = setInterval(async () => {
        try {
          const progressResponse = await fetch(`http://localhost:3001/progress/${downloadId}`);
          const progressData = await progressResponse.json();
          if (progressData.progress !== undefined && progressData.progress >= 0) {
            setProgress(progressData.progress);
          }
        } catch (e) {
          // Continue with current progress
        }
      }, 500);

      const response = await downloadPromise;
      clearInterval(progressInterval);
      
      const data = await response.json();
      if (response.ok) {
        setMessage('Audio downloaded to Downloads folder!');
        setDownloadedFile('audio');
        
        // Show completion notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('✅ Download Complete!', {
            body: `Audio saved to Downloads folder: ${videoInfo?.title || 'YouTube Audio'}`,
            tag: 'youtube-complete',
            requireInteraction: true
          });
        }
      } else {
        setMessage(`Error: ${data.error || 'Failed to download'}`);
      }
    } catch (error) {
      setMessage('Failed to connect to server');
    } finally {
      setCurrentDownloadId(null);
      setIsLoading(false);
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <h2>YouTube Video or Playlist URL</h2>
      
      <div>
        <label htmlFor="url">YouTube URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={isLoading}
          required
          style={{ margin: '5px', padding: '8px', width: '400px' }}
        />
        <button
          type="button"
          onClick={getFormats}
          disabled={isLoading || !url}
          style={{ margin: '5px', padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Get Info
        </button>
      </div>

      {videoInfo && (
        <div style={{ 
          margin: '20px 0', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          display: 'flex',
          gap: '15px',
          alignItems: 'flex-start'
        }}>
          {videoInfo.thumbnail && (
            <img 
              src={videoInfo.thumbnail} 
              alt="Video thumbnail"
              style={{ 
                width: '160px', 
                height: '90px', 
                objectFit: 'cover', 
                borderRadius: '4px',
                flexShrink: 0
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', lineHeight: '1.4' }}>
              {videoInfo.title}
            </h3>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
              {videoInfo.uploader && <div><strong>Channel:</strong> {videoInfo.uploader}</div>}
              {videoInfo.duration && (
                <div><strong>Duration:</strong> {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}</div>
              )}
              {videoInfo.view_count && (
                <div><strong>Views:</strong> {videoInfo.view_count.toLocaleString()}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {formats.length > 0 && (
        <div style={{ margin: '15px 0' }}>
          <label>Video Quality:</label>
          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            style={{ margin: '5px', padding: '5px', width: '200px' }}
          >
            <option value="">Best Available</option>
            {formats.map((f) => (
              <option key={f.format_id} value={f.format_id}>
                {f.height}p - {f.ext}
              </option>
            ))}
          </select>
        </div>
      )}

      {formats.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <button
            onClick={downloadVideo}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              margin: '5px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Download Video (with Audio)
          </button>
          
          <button
            onClick={downloadAudio}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              margin: '5px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Download Audio Only
          </button>
        </div>
      )}

      {isDownloading && (
        <div style={{ margin: '15px 0' }}>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            Progress: {Math.round(progress)}%
          </div>
          <div style={{ backgroundColor: '#e9ecef', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
            <div
              style={{
                backgroundColor: '#28a745',
                height: '100%',
                width: `${Math.max(0, Math.min(100, progress))}%`,
                transition: 'width 0.3s ease',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      )}

      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export const YoutubeApp = {
  id: 'youtube-downloader',
  name: 'YouTube Downloader',
  description: 'Download media from YouTube',
  icon: '🎬',
  component: YoutubeDownloader,
  tags: ['video', 'youtube', 'downloader', 'converter'],
  category: 'Media',
  keywords: ['youtube', 'download', 'video', 'mp4', 'mp3', 'converter'],
};