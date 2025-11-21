import { useState } from 'react';

const YoutubeDownloader = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formats, setFormats] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');

  const getFormats = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setMessage('Getting available formats...');
    setDownloadLink('');
    
    try {
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001/formats' : '/formats';
      const response = await fetch(apiUrl, {
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

  const generateDownloadLink = async (downloadAudio: boolean) => {
    setIsLoading(true);
    setMessage('Generating download link...');
    setDownloadLink('');
    
    try {
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001/download-link' : '/download-link';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          downloadAudio,
          quality: selectedQuality,
        }),
      });
      
      const data = await response.json();
      if (response.ok && data.url) {
        const filename = `${data.title}.${data.ext}`;
        const proxyUrl = `${window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001' : ''}/proxy-download?url=${encodeURIComponent(data.url)}&filename=${encodeURIComponent(filename)}`;
        setDownloadLink(proxyUrl);
        setDownloadFilename(filename);
        setMessage('');
      } else {
        setMessage(`Error: ${data.error || 'Failed to generate link'}`);
      }
    } catch (error) {
      setMessage('Failed to connect to server');
    } finally {
      setIsLoading(false);
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
            onClick={() => generateDownloadLink(false)}
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
            Get Video Link
          </button>
          
          <button
            onClick={() => generateDownloadLink(true)}
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
            Get Audio Link
          </button>
        </div>
      )}

      {downloadLink && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px',
          borderRadius: '4px',
          backgroundColor: '#d4edda',
          color: '#155724'
        }}>
          <p><strong>Download Link Generated!</strong></p>
          <a 
            href={downloadLink}
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginTop: '10px'
            }}
          >
            📥 Download Now
          </a>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>
            Link expires after a few minutes. Download will start automatically.
          </p>
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
