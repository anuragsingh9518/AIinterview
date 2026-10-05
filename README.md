# 🤖 AI Interview Agent

An AI-powered interview platform built with the **MERN stack** that simulates real interview experiences. Users can practice interviews, interact with an AI interviewer, and receive feedback to identify areas for improvement.

🔗 **Live Demo:** https://aiinterview-client-gspe.onrender.com/

---

## ✨ Features

- 🤖 **AI-Powered Interviews** — Conduct interactive interviews with an AI interviewer.
- 💬 **Real-Time Interaction** — Answer interview questions and continue the conversation dynamically.
- 🧠 **AI-Based Evaluation** — Analyze interview responses and generate meaningful feedback.
- 📊 **Performance Analysis** — Identify strengths and areas that need improvement.
- 🔐 **User Authentication** — Secure user registration and login.
- 📋 **Interview Sessions** — Create and manage interview sessions.
- 📱 **Responsive UI** — Designed to work across desktop and mobile devices.
- ⚡ **REST API** — Backend API built with Node.js and Express.
- 🗄️ **MongoDB Database** — Persistent storage for users and interview-related data.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- JWT Authentication

### AI

- Large Language Model API
- AI-powered question generation
- Response analysis
- Automated interview feedback

### Deployment

- Render
- MongoDB Atlas

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │    Node.js +        │
                    │    Express.js       │
                    └───────┬─────┬───────┘
                            │     │
                  ┌─────────┘     └──────────┐
                  ▼                          ▼
        ┌─────────────────┐        ┌─────────────────┐
        │    MongoDB      │        │    AI / LLM     │
        │    Database     │        │      API        │
        └─────────────────┘        └─────────────────┘
```

---

## 🔄 How It Works

1. User creates an account or logs in.
2. User starts a new interview session.
3. The AI generates relevant interview questions.
4. User submits their answers.
5. The AI analyzes the responses.
6. The system evaluates the interview performance.
7. Feedback is provided to help the user improve.

---

## 📸 Application

### Interview Dashboard

The application provides a clean interface for starting and managing AI-powered interview sessions.

### AI Interview

Users interact with the AI interviewer and answer questions as they would in a real interview.

### Feedback & Evaluation

After the interview, the system provides AI-generated feedback based on the user's responses.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm
- MongoDB or MongoDB Atlas
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository.git

cd your-repository
```

---

### 2. Install Dependencies

For the frontend:

```bash
cd client
npm install
```

For the backend:

```bash
cd ../server
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

AI_API_KEY=your_ai_api_key
```

> Never commit your `.env` file or API keys to GitHub.

---

### 4. Start the Backend

```bash
cd server
npm run dev
```

---

### 5. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application should now be available locally.

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 📁 Project Structure

```text
AI-Interview-Agent/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔐 Security

The application follows common web application security practices, including:

- JWT-based authentication
- Password hashing
- Environment variables for sensitive credentials
- Protected API routes
- Server-side validation
- MongoDB security

---

## 🎯 Project Goals

This project was built to explore how modern web applications can combine **full-stack development with AI** to create practical developer tools.

The main goals were to:

- Build a complete MERN application from scratch
- Design and consume REST APIs
- Implement authentication and authorization
- Integrate an AI/LLM API
- Store and retrieve application data using MongoDB
- Build an interactive AI-driven user experience
- Deploy a full-stack application to the cloud

---

## 🔮 Future Improvements

Planned improvements include:

- 🎙️ Voice-based interviews
- 🗣️ Speech-to-text integration
- 📈 Advanced performance analytics
- 🎯 Personalized interview preparation
- 🧑‍💼 Role-specific interview modes
- 💻 Coding interview support
- 📄 Resume-based interview generation
- 📊 Interview history and progress tracking
- ⚡ Real-time AI conversation
- 🌐 Support for multiple languages

---

## 🌐 Live Demo

Try the application:

**https://aiinterview-client-gspe.onrender.com/**

---

## 👨‍💻 Author

**Your Name**

Full-Stack Developer | MERN Stack | AI Applications

- GitHub: `https://github.com/your-username`
- LinkedIn: `https://linkedin.com/in/your-profile`

---

## ⭐ Support

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is licensed under the MIT License.
