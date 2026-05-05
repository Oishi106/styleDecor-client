## 🎨 StyleDecor – Smart Home & Ceremony Decoration Booking System

A full-stack MERN-based appointment and service management platform for home and ceremony decoration businesses. Users can explore decoration services, book consultations or on-site services, make secure payments, and track real-time project status through a role-based dashboard system.

---

## 🌐 Live Site : https://luxury-flan-e90d84.netlify.app/
🎯 Admin id : rohan123@gmail.com
🎯 Admin password : 123456

---

## 🖼️ Project Overview

StyleDecor is a modern solution for local decoration companies that struggle with walk-in crowd management, service coordination, and payment tracking.  
This system digitizes the entire workflow — from browsing decoration packages to booking services, assigning decorators, processing payments, and updating service status in real time.

The platform supports **Users**, **Decorators**, and **Admins** with fully role-based routing and dashboards.

---

## 🚀 Tech Stack

### Frontend
- React
- React Router DOM
- Firebase Authentication
- Tailwind CSS
- DaisyUI
- Framer Motion
- React Hook Form
- Axios
- React Leaflet
- React Icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token)
- Stripe Payment Gateway
- CORS
- Dotenv

---

## ⭐ Main Features

### 🔐 Authentication & Authorization
- Email & Password Login/Register
- Social Login (Google)
- JWT-based secure authentication
- Role-Based Routing (Admin / Decorator / User)
- Private route persistence (no logout on reload)

---

### 🏠 Home Page
- Dynamic Services Section (Loaded from server)
- Top Decorators Section with ratings & specialties
- Animated Hero Section using Framer Motion
- CTA button: **Book Decoration Service**
- Service Coverage Map (React Leaflet)

---

### 🧾 Services & Booking System
- Service listing with:
  - Search by service name
  - Filter by category & budget range
- Service Details Page (Public)
- Booking allowed only for logged-in users
- Booking includes date, time & location
- Booking data stored securely in MongoDB

---

### 💳 Payment System
- Stripe payment integration
- Secure transaction handling
- Payment history stored on server
- Payment receipt available in User Dashboard

---

### 📊 Dashboard System

#### 👤 User Dashboard
- My Profile
- My Bookings
- Update / Cancel Booking
- Payment History

#### 🛠️ Admin Dashboard
- Manage Decorators (CRUD)
- Approve / Disable Decorator Accounts
- Manage Services & Packages (CRUD)
- Assign Decorators for On-Site Services
- Manage All Bookings
- Revenue Monitoring
- Analytics Charts:
  - Service Demand Histogram
  - Booking Statistics

#### 🎯 Decorator Dashboard
- View Assigned Projects
- Today's Schedule
- Step-by-step Project Status Update
- Earnings Summary
- Payment History Check

---

### 📌 On-Site Service Status Flow
- Assigned  
- Planning Phase  
- Materials Prepared  
- On the Way to Venue  
- Setup in Progress  
- Completed  

---

### 🧿 Additional Features
- Global Loading Spinner
- Global Error Page
- Toast Notifications (Success/Error)
- Pagination (Single Page)
- Mobile Responsive Design
- Skeleton loaders for async data
- Secure environment variables (.env)

---

## 📦 Dependencies

### Client
- react
- react-router-dom
- firebase
- tailwindcss
- daisyui
- framer-motion
- react-hook-form
- axios
- react-leaflet
- react-icons
- react-hot-toast

### Server
- express
- mongodb
- cors
- dotenv
- jsonwebtoken
- stripe

---

## 🔐 Environment Variables

### Client (.env)
