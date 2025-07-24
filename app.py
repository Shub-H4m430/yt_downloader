from flask import Flask, request, render_template, send_file
import yt_dlp
import os

app = Flask(__name__)
download_folder = "downloads"

if not os.path.exists(download_folder):
    os.makedirs(download_folder)

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/download", methods=["POST"])
def download():
    url = request.form.get("yt_link")
    fmt = request.form.get("format")

    if not url:
        return "No URL submitted!"

    try:
        if fmt == "audio":
            audio_opts = {
                'format': 'bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio',
                'outtmpl': f'{download_folder}/%(title)s.%(ext)s',
                'quiet': True,
                'extractaudio': True,
                'audioformat': 'mp3',
                'audioquality': '0',  # Best audio quality
                'ffmpeg_location': r'C:\Users\Shubham\Videos\ffmpeg-7.1.1-full_build\ffmpeg-7.1.1-full_build\bin'
            }
            with yt_dlp.YoutubeDL(audio_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
            return send_file(filename, as_attachment=True)

        elif fmt == "1080p":
            video_opts = {
                'format': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]',
                'outtmpl': f'{download_folder}/%(title)s.%(ext)s',
                'quiet': True,
                'merge_output_format': 'mp4',  # Ensures MP4 output
                'ffmpeg_location': r'C:\Users\Shubham\Videos\ffmpeg-7.1.1-full_build\ffmpeg-7.1.1-full_build\bin'
            }
            with yt_dlp.YoutubeDL(video_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
            return send_file(filename, as_attachment=True)

        elif fmt == "1440p":
            video_opts = {
                'format': 'bestvideo[height<=1440]+bestaudio/best[height<=1440]',
                'outtmpl': f'{download_folder}/%(title)s.%(ext)s',
                'quiet': True,
                'merge_output_format': 'mp4',
                'ffmpeg_location': r'C:\Users\Shubham\Videos\ffmpeg-7.1.1-full_build\ffmpeg-7.1.1-full_build\bin'
            }
            with yt_dlp.YoutubeDL(video_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
            return send_file(filename, as_attachment=True)

        elif fmt == "4k":
            video_opts = {
                'format': 'bestvideo[height<=2160]+bestaudio/best[height<=2160]',
                'outtmpl': f'{download_folder}/%(title)s.%(ext)s',
                'quiet': True,
                'merge_output_format': 'mp4',
                'ffmpeg_location': r'C:\Users\Shubham\Videos\ffmpeg-7.1.1-full_build\ffmpeg-7.1.1-full_build\bin'
            }
            with yt_dlp.YoutubeDL(video_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
            return send_file(filename, as_attachment=True)

        else:  # best available format
            default_opts = {
                'format': 'bestvideo+bestaudio/best',  # Best video + best audio
                'outtmpl': f'{download_folder}/%(title)s.%(ext)s',
                'quiet': True,
                'merge_output_format': 'mp4',
            }
            with yt_dlp.YoutubeDL(default_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
            return send_file(filename, as_attachment=True)

    except Exception as e:
        return f"Download failed: {str(e)}"

if __name__ == "__main__":
    app.run(debug=True)