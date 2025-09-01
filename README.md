# Note-Taking Application

A full-stack note-taking application built with React, Express.js, and MongoDB. Features secure email-based authentication with OTP verification and a beautiful, responsive user interface.

## 🚀 Features

- **Secure Authentication**: Email-based signup and login with OTP verification
- **Note Management**: Create, view, and delete personal notes
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Real-time Validation**: Form validation with helpful error messages
- **JWT Security**: Token-based authorization for API endpoints
- **Modern UI**: Beautiful design with smooth animations and transitions

## 🛠️ Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (UI components)
- React Router (navigation)
- Context API (state management)

**Backend:**
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT (authentication)
- SendGrid (email service)
- Zod (validation)

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- SendGrid account for email services

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Devarora13/Note-Taking-App.git
cd Note-Taking-App
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/note-taking-app
JWT_SECRET=your-super-secret-jwt-key
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM=your-verified-sender-email@domain.com
FRONTEND_URL=http://localhost:8080
```

**Start the backend server:**
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend development server:**
```bash
npm run dev
```
Frontend will run on `http://localhost:8080`

## 🔧 Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder using any static file server
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/request-otp` - Request OTP for signup/signin
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token

### Notes (Protected Routes)
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create a new note
- `DELETE /api/notes/:id` - Delete a specific note

## 🎨 Design Features

- **Beautiful UI**: Modern design with blue gradient theme
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Subtle transitions and hover effects
- **Dark/Light Mode**: Supports both themes
- **Loading States**: Visual feedback for all user interactions

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Both frontend and backend validation
- **OTP Verification**: Email-based two-factor authentication
- **Protected Routes**: API endpoints secured with middleware
- **Error Handling**: Comprehensive error handling and user feedback

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM=your-verified-email
FRONTEND_URL=http://localhost:8080
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment (Railway/Render/Vercel)
1. Connect your repository to your chosen platform
2. Set environment variables in the platform dashboard
3. Deploy the `backend` directory

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set the production API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Dev Arora**
- GitHub: [@Devarora13](https://github.com/Devarora13)
- Project: [Note-Taking-App](https://github.com/Devarora13/Note-Taking-App)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [SendGrid](https://sendgrid.com/) for email services
- [MongoDB](https://mongodb.com/) for database

---

**Made with ❤️ using React, Express.js, and MongoDB**