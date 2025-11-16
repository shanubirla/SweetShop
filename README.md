.

---

# 🍰 **Sweet Shop Management System**

## 🌐 **Live Demo**

👉 ****

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Visit_Now-brightgreen?style=for-the-badge)](https://sweet-heaven.vercel.app/)

A **full-stack e-commerce platform** designed for sweet shop management. Built using **Node.js, Express, MongoDB, React**, and fully developed with **Test-Driven Development (TDD)** methodology.
Includes complete authentication, cart, orders, coupons, admin panel, and responsive UI.

---

# 📖 **Overview**

This project showcases production-ready full-stack architecture and modern development practices:

* **Backend:** Node.js, Express, MongoDB (Mongoose)
* **Frontend:** React + Vite + React Router
* **Testing:** Jest + Supertest (backend), Vitest + React Testing Library (frontend)
* **Authentication:** JWT + bcrypt
* **Design:** Minimalist white–black–rose UI (#FF6B9D)
* **Architecture:** Modular, scalable, TDD-verified

---

# 🎯 **Features**

## 🔧 Backend Features

✔ User registration & login (JWT)
✔ Role-based access control (User/Admin)
✔ Sweet products CRUD
✔ Cart system with quantity & stock checks
✔ Order placement, cancellation & stock restoration
✔ Discount/coupon application logic
✔ Search & filtering (sweet name / category / price)
✔ Complete admin inventory management
✔ Purchase history generation
✔ Local + Cloud MongoDB support

---

## 🎨 Frontend Features

✔ Authentication (Login/Register)
✔ Modern dashboard with sweet listings
✔ Collapsible search & filter panel
✔ Sweet details with “Buy Now”
✔ Full shopping cart with quantity updates
✔ Coupon input & discount calculation
✔ Order management & history
✔ Bill generation (print + PDF-ready)
✔ Admin dashboard (edit/delete products)
✔ Mobile-friendly responsive UI
✔ Elegant white/black/rose theme
✔ Toast alerts & notifications

---

# 🛠️ **Technology Stack**

### 📌 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcrypt
* Jest + Supertest

### 📌 Frontend

* React 19
* Vite
* React Router v7
* axios
* Vitest + RTL
* Custom CSS (minimalistic)

---

# 📂 **Project Structure**

```
tdd/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── jest.config.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── vite.config.js
│   ├── vitest.config.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ **Setup Instructions**

## ▶ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
MONGODB_URI=your_mongo_url
JWT_SECRET=your_secret
PORT=3000
```

Run backend:

```bash
npm run dev
```

---

## ▶ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

# 🧪 **Running Tests**

## Backend Tests

```bash
cd backend
npm test
```

## Frontend Tests

```bash
cd frontend
npm test
```

All tests follow **TDD Red → Green → Refactor** workflow.

---

# 📡 **API Endpoints**

### Base URL:

```
http://localhost:3000/api
```

### Includes:

* Auth (register, login)
* Sweets CRUD
* Cart operations
* Order operations
* Search & filtering
* Coupon validation

(Full documentation inside README.md API section)

---

# 🔴🟢🟢 **TDD Methodology**

### 🔴 RED

Write failing tests first

### 🟢 GREEN

Write just enough code to pass

### 🟦 REFACTOR

Optimize, clean, improve performance

This ensures **predictability, reliability, and maintainability**.

---

# 🗄️ **Database Models**

* User
* Sweet
* Cart
* Order

Each model includes validation, references, and required fields.

---

# 📌 **Common Commands**

### Backend

```bash
npm run dev
npm test
```

### Frontend

```bash
npm run dev
npm test
npm run build
```

---

# 🎨 **Design System**

### 🎨 Colors

| Role       | Color            |
| ---------- | ---------------- |
| Primary    | `#FF6B9D` (Rose) |
| Background | `#FFFFFF`        |
| Text       | `#000000`        |
| Borders    | `#F5F5F5`        |

### ✍ Typography

* **Font:** Poppins
* Clean, minimal UI
* No shadows or gradients
* Tight spacing & alignment for polished layout

---

# 🔐 **Security Features**

* bcrypt password hashing
* JWT-based authentication
* Secure token storage
* XSS-safe designs
* Role-based access control
* Stock reservation system
* Coupon expiry & validation
* Strict CORS management

---

# 🖼 **Screenshots**

*(Add actual screenshots here)*

---

# 🤖 **AI Usage Breakdown**

### AI Assisted In:

* Boilerplate and scaffolding
* Jest & RTL test generation
* React components setup
* Controller & service boilerplate
* CSS structure
* Debugging hints

### Fully Manual Work:

* Database schema design
* Business logic
* TDD cycle execution
* UX & UI decisions
* Security logic
* Deployments
* Integration debugging

---

# 🛠️ **Troubleshooting Guide**

### ❗ MongoDB Not Connecting

✔ Check `.env`
✔ Ensure Atlas IP whitelist
✔ Restart backend

### ❗ Frontend can't connect to backend

✔ Update `VITE_API_URL`

### ❗ Port already in use

```bash
npx kill-port 3000
```

### ❗ Coupon not applying

✔ Ensure created and active
✔ Ensure not expired

### ❗ UI alignment issues

✔ Use responsive grid
✔ Clear cache

---

# ✨ **Recent Updates (v2.0)**

* ⚡ “Buy Now” instant checkout
* 🎟 Coupon/discount system
* 🗂 Admin edit/delete from dashboard
* 🧭 Collapsible filter panel
* 📱 Mobile navbar improvements
* 🎨 Minimalist UI revamp
* ☁ Vercel deployment + Render backend
* 🔧 Codebase refactor

---

# 🚀 **Future Enhancements**

* Online payment integration
* Wishlist system
* Reviews & ratings
* Email notifications
* Analytics dashboard
* React Native mobile app
* SMS alerts

---

# 📄 **License**

MIT License

---

# 📞 **Support**

For issues or improvements → Open a GitHub issue.

---

# ❤️ **Built with care using TDD**

✔ 30+ Tests Passing
✔ Clean Architecture
✔ Fully Documented
✔ AI-Assisted + Human Tested
✔ Production Ready

---


