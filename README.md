# 🧠 Taskify — Task & Project Management App

Taskify is a full-stack task and project management application designed for teams to collaborate efficiently. Built with **React**, **Node.js**, **Express**, and **MongoDB**, it supports authentication, role-based access, project/task CRUD, drag-and-drop task organization, and more.

---

## 🚀 Features

- 🧑‍💼 **Role-based access** (Manager, Member)
- 📁 **Projects**: create, view, delete, manage members
- ✅ **Tasks**: add, delete, mark as complete/incomplete
- 🧲 **Drag-and-drop task board**
- 🔔 **Notifications**
- 🌐 **JWT Auth** (with HTTP-only cookies)
- 🎨 **Responsive UI** (with Tailwind CSS)
- ☁️ **API-first architecture** (RESTful)

---

## 🧰 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Axios + React DnD
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: JWT with Refresh Tokens (stored in cookies)
- **State Management**: React Context API
- **Deployment**: Vercel (Frontend) + Render/Any Node Host (Backend)

---

## 🛠 Setup Instructions

### 📦 Prerequisites

- Node.js >= 18
- MongoDB running locally or remotely

### 🔧 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Set your Mongo URI, JWT secrets in .env

npm run dev
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL to your backend endpoint

npm run dev
```

---

## 🧪 Testing

You can run tests (if set up) using:

```bash
npm test
```

---

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── controllers/
│   ├── routes/
│   └── models/
├── frontend/
│   ├── components/
│   ├── pages/
│   └── hooks/
```

---

## 🗒 Changelog

All notable changes are documented in [`CHANGELOG.md`](./CHANGELOG.md)

---

## 🔐 Security

- Cookies are `HttpOnly`, `Secure` in production
- CORS configured to allow only trusted origins
- JWT rotation implemented for safety

---

## 📜 License

MIT License — feel free to use, modify, and distribute.

---

## 👨‍💻 Author

Made with ❤️ by Subhranshu
