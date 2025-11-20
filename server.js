import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Store progress for each download
const downloadProgress = new Map();
const activeDownloads = new Set();

app.use(cors());
app.use(express.json());

app.get('/progress/:downloadId', (req, res) => {
  const { downloadId } = req.params;
  const progress = activeDownloads.has(downloadId) ? (downloadProgress.get(downloadId) || 0) : -1;
  res.json({ progress });
});

app.post('/formats', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const tempScript = `
import yt_dlp
import json

url = "${url}"

try:
    with yt_dlp.YoutubeDL({
        'quiet': True,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'cookiesfrombrowser': None
    }) as ydl:
        info = ydl.extract_info(url, download=False)
        formats = []
        for f in info['formats']:
            if f.get('vcodec') != 'none' and f.get('height'):
                formats.append({
                    'format_id': f['format_id'],
                    'ext': f['ext'],
                    'height': f['height'],
                    'filesize': f.get('filesize', 0)
                })
        
        formats = sorted(formats, key=lambda x: x['height'], reverse=True)
        
        # Get video info
        video_info = {
            'title': info['title'],
            'thumbnail': info.get('thumbnail', ''),
            'duration': info.get('duration', 0),
            'uploader': info.get('uploader', ''),
            'view_count': info.get('view_count', 0),
            'formats': formats[:10]
        }
        
        print(json.dumps(video_info))
except Exception as e:
    print(json.dumps({'error': str(e)}))
`;

  const tempFile = 'temp_formats.py';
  let output = '';
  
  fs.writeFileSync(tempFile, tempScript);
  
  const python = spawn('python', [tempFile]);
  
  python.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  python.on('close', (code) => {
    try {
      fs.unlinkSync(tempFile);
    } catch (e) {}
    
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: 'Failed to get formats' });
    }
  });
});

app.post('/download', (req, res) => {
  const { url, downloadAudio, downloadVideo, quality, downloadId } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Mark download as active
  if (downloadId) {
    activeDownloads.add(downloadId);
  }

  const tempScript = `
import os
import yt_dlp
import sys

url = "${url}"
download_audio = ${downloadAudio ? 'True' : 'False'}
download_video = ${downloadVideo ? 'True' : 'False'}
download_id = "${downloadId || ''}"

import os
import tempfile

# Use temp directory for all intermediate files
temp_dir = tempfile.mkdtemp()
audio_folder = os.path.join(os.path.expanduser("~"), "Downloads")
video_folder = os.path.join(os.path.expanduser("~"), "Downloads")
os.makedirs(audio_folder, exist_ok=True)
os.makedirs(video_folder, exist_ok=True)

try:
    if download_audio:
        print("Downloading audio...")
        audio_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '320',
            }],
            'progress_hooks': [lambda d: print(f"PROGRESS:{download_id}:{d['_percent_str']}") if d['status'] == 'downloading' else None],
            'nopart': True,
            'keepvideo': False,
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'cookiesfrombrowser': None
        }
        with yt_dlp.YoutubeDL(audio_opts) as ydl:
            ydl.download([url])
        
        # Move final MP3 to Downloads with duplicate handling
        for file in os.listdir(temp_dir):
            if file.endswith('.mp3'):
                dest_path = os.path.join(audio_folder, file)
                counter = 2
                while os.path.exists(dest_path):
                    name, ext = os.path.splitext(file)
                    dest_path = os.path.join(audio_folder, f"{name} ({counter}){ext}")
                    counter += 1
                os.rename(os.path.join(temp_dir, file), dest_path)
    
    if download_video:
        print("Downloading video...")
        video_format = '${quality || 'best[height<=1080]/best'}'
        video_opts = {
            'format': video_format,
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
            'merge_output_format': 'mp4',
            'progress_hooks': [lambda d: print(f"PROGRESS:{download_id}:{d['_percent_str']}") if d['status'] == 'downloading' else None],
            'nopart': True,
            'keepvideo': False,
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'cookiesfrombrowser': None
        }
        with yt_dlp.YoutubeDL(video_opts) as ydl:
            ydl.download([url])
        
        # Move final MP4 to Downloads with duplicate handling
        for file in os.listdir(temp_dir):
            if file.endswith('.mp4'):
                dest_path = os.path.join(video_folder, file)
                counter = 2
                while os.path.exists(dest_path):
                    name, ext = os.path.splitext(file)
                    dest_path = os.path.join(video_folder, f"{name} ({counter}){ext}")
                    counter += 1
                os.rename(os.path.join(temp_dir, file), dest_path)
    
    print("SUCCESS: Download complete")
except Exception as e:
    print(f"ERROR: {str(e)}")
    sys.exit(1)
finally:
    # Clean up temp directory
    import shutil
    try:
        shutil.rmtree(temp_dir)
    except:
        pass
`;

  const tempFile = 'temp_download.py';
  let output = '';
  let errorOutput = '';
  
  fs.writeFileSync(tempFile, tempScript);
  
  const python = spawn('python', [tempFile]);
  
  let progressInterval;
  
  python.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    console.log(`stdout: ${text}`);
    
    if (text.includes('PROGRESS:')) {
      const match = text.match(/PROGRESS:([^:]+):([\d.]+)%?/);
      if (match) {
        const [, id, progressStr] = match;
        const progress = parseFloat(progressStr.replace('%', ''));
        if (!isNaN(progress)) {
          downloadProgress.set(id, progress);
          console.log(`Progress ${id}: ${progress}%`);
        }
      }
    }
  });
  

  
  python.stderr.on('data', (data) => {
    const text = data.toString();
    errorOutput += text;
    console.error(`stderr: ${text}`);
  });
  
  python.on('close', (code) => {
    clearInterval(progressInterval);
    
    // Set final progress to 100% before cleanup
    if (downloadId && code === 0) {
      downloadProgress.set(downloadId, 100);
      // Clean up progress after 2 seconds
      setTimeout(() => {
        downloadProgress.delete(downloadId);
        activeDownloads.delete(downloadId);
      }, 2000);
    } else if (downloadId) {
      downloadProgress.delete(downloadId);
      activeDownloads.delete(downloadId);
    }
    
    try {
      fs.unlinkSync(tempFile);
    } catch (e) {}
    
    if (code === 0 && output.includes('SUCCESS')) {
      res.json({ success: true, message: 'Download completed successfully!' });
    } else {
      const errorMsg = errorOutput || output || 'Unknown error occurred';
      console.error('Download failed:', errorMsg);
      res.status(500).json({ error: `Download failed: ${errorMsg}` });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Download server running on http://localhost:${PORT}`);
  console.log('Ready to accept download requests!');
});