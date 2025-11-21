Yes, you can use a Raspberry Pi 4 instead of Render. It will work better for YouTube downloads since it uses a residential IP. Here's how:

Install Node.js on RPi4:

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

Copy
Install Python and dependencies:

sudo apt-get install -y python3 python3-pip ffmpeg
pip3 install yt-dlp

Copy
bash
Clone and run your project:

git clone https://github.com/HIP24/IboMiniApps.git
cd IboMiniApps
npm install
npm run build
tsx server.ts

Copy
bash
Access it:

Locally: http://localhost:3001

From other devices: http://<your-rpi-ip>:3001

Make it persistent (optional): Use pm2 to keep it running:

npm install -g pm2
pm2 start "tsx server.ts" --name ibominiapps
pm2 startup
pm2 save

Copy
bash
The RPi4 will work great for this since YouTube won't block residential IPs like it does server IPs.