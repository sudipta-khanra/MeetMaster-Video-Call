# 📹 MeetMaster — Real-Time Video Conferencing Platform

MeetMaster is a high-performance, full-stack video conferencing system designed for low-latency communication. Built with the MERN stack, it leverages WebRTC for peer-to-peer media streaming and Socket.io for real-time signaling and instant messaging.

### 🔗 [Live Demo: MeetMaster](https://meetmaster-zoom-frontend.onrender.com/)

---

## 🚀 Key Features
- **P2P Video & Audio:** High-quality, low-latency media streaming using `WebRTC`.
- **Real-time Signaling:** Seamless connection handling and instant chat synchronization via `Socket.io`.
- **Screen Sharing:** Integrated browser Media APIs to enable high-definition screen sharing.
- **Secure Access:** JWT-based authentication ensures only authorized users can create or join meetings.
- **Meeting Scheduling:** Persistent storage with MongoDB to manage and schedule future conferences.
- **Responsive Interface:** A modern, sleek UI built with `React` and `Tailwind CSS`.

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Real-time:** WebRTC, Socket.io
- **Database:** MongoDB, Mongoose
- **Security:** JWT (JSON Web Tokens)
- **Deployment:** Render / Vercel

## 📂 Project Structure
- `client/src/context/`: Managing WebRTC peer connections and socket states.
- `client/src/components/`: Reusable video tiles, chat overlays, and controls.
- `server/socket/`: Handling signaling logic and room management.
- `server/routes/`: Secure API endpoints for user auth and meeting data.

## ⚙️ Installation & Local Setup
1. Clone the repository:
   ```bash
   git clone [https://github.com/sudipta-khanra/MeetMaster-Video-Call.git]
   
