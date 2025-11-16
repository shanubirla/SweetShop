

<div align="center">

# ✨🍮 **THE MITHAI BOX**  
### *Premium Sweet Shop Management System*  
#### MERN • Golden Brown UI • Admin + Super Admin • Full E-Commerce Flow  

<img src="https://img.icons8.com/emoji/96/custard.png" width="90"/>

---

# 🚀 Live Demo  
### 🔗 https://your-live-demo-link.com  
*(Replace with your actual link)*

---

# 🛠 Tech Stack Badges

### **Frontend**
![React](https://img.shields.io/badge/React-18.0+-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Frontend-yellow?style=for-the-badge&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![CSS](https://img.shields.io/badge/Custom_CSS-Golden_Theme-brown?style=for-the-badge)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-API-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-purple?style=for-the-badge&logo=jsonwebtokens)
![Bcrypt](https://img.shields.io/badge/Bcrypt-Security-red?style=for-the-badge)

---

</div>

# 🍰 Overview

**The Mithai Box** is a full-stack MERN application built for sweet shop businesses with:

✔ Luxury **golden-brown mithai theme**  
✔ Customer shopping experience  
✔ Admin inventory + order management  
✔ Super Admin operations dashboard  
✔ Coupons, banners, billing system  
✔ Real-time-like UI feedback  

---

# ✨ Features

## 🛍 Customer
- Browse sweets with photos & categories  
- Add to cart / Buy now  
- Product details with stock indicator  
- Smart search filters  
- Apply coupons  
- Track orders with status icons  
- Download **PDF-ready bill**  

---

## 👑 Admin
- Add/Edit/Delete sweets  
- Stock control + low-stock warnings  
- Manage orders + update status  
- Inventory insights  

---

## 🧠 Super Admin
- Business analytics (orders, revenue, stock)  
- Discount campaign builder  
- Banner management (hero + sections)  
- Customer role & account control  
- Operation-level dashboards  

---

# 🎨 UI Theme – The Mithai Gold Standard

| Purpose | Color |
|--------|--------|
| Primary | `#B88646` (Royal Gold) |
| Accent | `#C59B5F` |
| Background | `#FFF4E6` |
| Text | `#3E2F1D` |
| Borders | `#E8DCC5` |

---

# 🖼 Screenshots (Add Your Images)

### 🏠 Home Page  
![Home](assets/home.png)

### 🍬 Dashboard  
![Dashboard](assets/dashboard.png)

### 🧁 Product Detail  
![Product](assets/product.png)

### 🛒 Cart  
![Cart](assets/cart.png)

### 📦 Orders Page  
![Orders](assets/orders.png)

### 👑 Super Admin Dashboard  
![SuperAdmin](assets/superadmin.png)

---

# 🗄 Database Schema Diagram

```

┌───────────────┐        ┌───────────────┐
│    USERS      │1──────∞│    ORDERS     │
└───────────────┘        └───────────────┘
│                         │
│                         │∞
│                 ┌─────────────┐
│                 │  ORDERITEMS │
│                 └─────────────┘
│
│1
┌───────────────┐
│    CART       │
└───────────────┘
│∞
┌───────────────┐
│   CARTITEMS   │
└───────────────┘

┌───────────────┐
│    SWEETS     │
└───────────────┘

┌───────────────┐
│   DISCOUNTS   │
└───────────────┘

┌───────────────┐
│    BANNERS    │
└───────────────┘

````

---

# 📡 API Documentation

Below is the **professional API table**.

## 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/login-admin` | Admin login |

---

## 🍬 Sweets API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/sweets` | Public | Get all sweets |
| POST | `/api/sweets` | Admin | Create a sweet |
| PUT | `/api/sweets/:id` | Admin | Edit sweet |
| DELETE | `/api/sweets/:id` | Admin | Delete sweet |

---

## 🛒 Cart API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item |
| PUT | `/api/cart/update` | Update quantity |
| DELETE | `/api/cart/:sweetId` | Remove item |

---

## 📦 Orders API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | User | Create order |
| GET | `/api/orders` | User | Get user orders |
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/orders/status/:id` | Admin | Update status |
| PUT | `/api/orders/cancel/:id` | User/Admin | Cancel order |

---

## 🎟 Discount API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/discounts/validate` | User | Apply coupon |
| POST | `/api/discounts` | Admin | Create coupon |
| GET | `/api/discounts` | Admin | List coupons |
| DELETE | `/api/discounts/:id` | Admin | Delete coupon |

---

## 📢 Banner API

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/banners` | Admin |
| POST | `/api/banners` | Admin |
| DELETE | `/api/banners/:id` | Admin |

---

# ⚙️ Setup Instructions

## Backend
```bash
cd backend
npm install
npm run dev
````

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🔮 Future Enhancements

* Online payment gateway
* Automated SMS/Email notifications
* Ingredient/recipe management
* Sales graphs with charts
* Multi-vendor support
* Delivery partner dashboard

---

# ❤️ Built With Love & Mithai

If you like this project, please ⭐ star the repo :)

```

---

