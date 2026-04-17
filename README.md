# Hostel Management System# HostelMS Pro — Smart College Hostel Management System



A full-stack hostel management application built with React, Express.js, and MongoDB.## Features

- 3 Role Logins: Admin, Staff, Student

## 🎯 Features- 300 Rooms: 5 Floors × 60 rooms (40 Non-AC + 20 AC)

- Room Booking (Student)

- **Student Management** - Register and manage student information- Payment Gateway: UPI, Card, Net Banking

- **Room Booking** - Browse and book available rooms- Complaint Management

- **Payment Processing** - Track payments with CSV export- Fee Tracking & Transactions

- **Complaint Management** - Submit and resolve complaints

- **Admin Dashboard** - Full control over rooms, students, and payments## Getting Started

- **User Authentication** - Role-based access (Admin, Staff, Student)

- **MongoDB Persistence** - All data stored in MongoDB### Prerequisites

- Node.js 18+

## 🏗️ Project Structure- npm or yarn



```### Run Locally

hostel-ms/```bash

├── frontend/              # React + Vitenpm install

│   ├── src/npm run dev

│   ├── public/```

│   ├── package.jsonOpen http://localhost:5173

│   └── vite.config.js

├── backend/              # Express.js API## Demo Logins

│   ├── server.js| Role    | Email                  | Password  |

│   ├── package.json|---------|------------------------|-----------|

│   └── .env| Admin   | admin@hostel.edu       | admin123  |

├── package.json| Staff   | suresh@hostel.edu      | staff123  |

├── render.yaml| Student | arjun@student.edu      | stu123    |

└── .gitignore| Student | priya@student.edu      | stu123    |

```| Student | rahul@student.edu      | stu123    |



## 🚀 Quick Start## Room Pricing

- Non-AC Rooms (01–40 per floor): ₹22,000/semester

### Local Development- AC Rooms (41–60 per floor): ₹35,000/semester



```bash## Tech Stack

# Install all dependencies- React 18

npm run install-all- Vite

- CSS-in-JS (no extra dependencies)

# Start MongoDB (ensure it's running)
mongod

# Run development servers
npm run dev
```

- Backend: http://localhost:5001
- Frontend: http://localhost:5173

### Production

```bash
npm run build
npm start
```

## 🔧 Configuration

Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/hostel-ms
PORT=5001
NODE_ENV=development
```

For MongoDB Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/hostel-ms`

## 📦 Scripts

```bash
npm run dev           # Frontend + Backend
npm run server        # Backend only
npm run frontend      # Frontend only
npm run build         # Build for production
npm start             # Production server
npm run setup         # Install + Build (for deployment)
```

## 🌐 Deploy on Render

1. Create MongoDB Atlas database at https://www.mongodb.com/cloud/atlas
2. Push to GitHub
3. Go to https://render.com → New Web Service
4. Connect GitHub repo
5. Set environment variable: `MONGODB_URI=<your_atlas_connection_string>`
6. Deploy!

Your app will be live at: `https://your-app.onrender.com`

## 👥 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hostel.com | admin123 |
| Staff | staff@hostel.com | staff123 |
| Student | s001@hostel.com | student123 |

## 🛠️ Technologies

- React 18, Vite 5
- Node.js, Express.js
- MongoDB, Mongoose
- Render (deployment)

## 🐛 Troubleshooting

- **MongoDB Error**: Check `.env` and ensure MongoDB is running
- **Frontend Not Loading**: Run `npm run build`
- **API Failing**: Verify backend on port 5001

## 📞 Support

Check logs: `npm run dev` shows both frontend and backend output

---

**Deploy in 5 minutes! 🚀**
