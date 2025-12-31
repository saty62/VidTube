Vidtube – Video Backend API

A scalable backend API for a video-sharing platform that supports secure video uploads, user authentication, and media metadata management. Built using modern backend technologies and RESTful design principles.

Features

User authentication and authorization using JWT

Secure video upload and media handling

Video metadata storage and retrieval

RESTful API architecture

Modular and scalable backend structure

Environment-based configuration for security

Tech Stack

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (Access & Refresh Tokens)

File Handling: Multer / Cloudinary

Version Control: Git, GitHub

Project Structure
vidtube/
│── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   └── app.js
│── public/
│── package.json
│── .env.example
│── README.md

API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	User login
POST	/api/videos/upload	Upload video
GET	/api/videos	Get all videos
GET	/api/videos/:id	Get video details
Environment Variables

Create a .env file in the root directory and add:

PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET

Installation & Setup
git clone https://github.com/saty62/vidtube.git
cd vidtube
npm install
npm run dev


Server will start on:

http://localhost:5000

Future Enhancements

Video streaming support

Like, comment, and subscribe functionality

Role-based access control

Pagination and search optimization

Author

PRIYADARSHAN SATYAM BHARTI

GitHub: https://github.com/saty62

LinkedIn: www.linkedin.com/in/priyadarshan-satyam-bharti-2904a228b

License

This project is licensed under the MIT License.
