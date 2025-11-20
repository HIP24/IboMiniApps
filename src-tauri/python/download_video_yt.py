# download_yt_best.py
import os
import yt_dlp

# SETTINGS
url = "https://www.youtube.com/watch?v=6UmGnqK4hL8"  # Playlist or single video
download_audio = True   # True = download MP3
download_video = True    # True = download MP4

# Folders
audio_folder = "downloads_audio"
video_folder = "downloads_video"
os.makedirs(audio_folder, exist_ok=True)
os.makedirs(video_folder, exist_ok=True)

# Audio options (best quality)
audio_opts = {
    'format': 'bestaudio/best',
    'outtmpl': os.path.join(audio_folder, '%(title)s.%(ext)s'),
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '320',  # maximum MP3 quality
    }],
}

# Video options (best quality)
video_opts = {
    'format': 'bestvideo+bestaudio/best',  # combine best video and audio quality
    'merge_output_format': 'mp4',
    'outtmpl': os.path.join(video_folder, '%(title)s.%(ext)s'),
    'noplaylist': False,  # support playlists
}

# Download audio
if download_audio:
    print("Downloading audio in best quality...")
    with yt_dlp.YoutubeDL(audio_opts) as ydl:
        ydl.download([url])

# Download video
if download_video:
    print("Downloading video in best quality...")
    with yt_dlp.YoutubeDL(video_opts) as ydl:
        ydl.download([url])

print("Download complete.")
