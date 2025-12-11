# Festivio System Backend
A complete production-grade backend for managing clubs, events, memberships, payments, and role-based dashboards.

---

## 🚀 Features
- JWT Authentication (httpOnly cookies)
- Role-based Access Control (Admin, Manager, Member)
- Club Management (CRUD + Approval System)
- Events + Registration System
- Memberships with expiry logic
- Stripe Payments (Checkout + Payment Intent + Webhooks)
- Full dashboards for Admin, Manager, Member
- Clean and scalable folder structure

---

## 📁 Folder Structure 
```
backend/
└── src/
    ├── config/
    │   └── firebase.js
    │
    ├── Controllers/
    │   ├── authController.js
    │   ├── clubController.js
    │   ├── eventController.js
    │   ├── eventRegistrationController.js
    │   ├── membershipController.js
    │   └── paymentController.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── errorHandler.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Club.js
    │   ├── Event.js
    │   ├── EventRegistration.js
    │   ├── Membership.js
    │   └── Payment.js
    │
    ├── Routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── clubRoutes.js
    │   ├── eventRoutes.js
    │   ├── eventRegistrationRoutes.js
    │   ├── managerRoutes.js
    │   ├── memberRoutes.js
    │   ├── membershipRoutes.js
    │   └── paymentRoutes.js
    │
    ├── app.js
    └── server.js
```

---

# 📘 APIS (53 Endpoints)


---

# 🔐 Auth Routes (3)
**Base: `/api/auth`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /firebase-login | Login using Firebase Token |
| POST | /logout | Destroy session cookie |
| GET | /me | Get logged-in user info |

---

# 🛡 Admin Routes (6)
**Base: `/api/dashboard/admin`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /overview | Dashboard summary |
| GET | /users | Paginated users list |
| PATCH | /users/:id/role | Update user role |
| GET | /clubs | Clubs with counts + pagination |
| PATCH | /clubs/:id/status | Approve / Reject club |
| GET | /payments | Payments with relations |

---

# 🏛 Club Routes (6)
**Base: `/api/clubs`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get approved clubs with filters |
| GET | /:id | Get club details |
| POST | / | Create a club (Manager only) |
| PUT | /:id | Update club (Admin/Manager) |
| PATCH | /:id/status | Approve/Reject club (Admin) |
| DELETE | /:id | Delete club |

---

# 🎟 Event Registration Routes (4)
**Base: `/api/event-registrations`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Register for event |
| PUT | /cancel/:id | Cancel registration |
| GET | /my | User’s own event registrations |
| GET | /event/:eventId | Manager view event registrations |

---

# 📅 Event Routes (6)
**Base: `/api/events`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Admin: all events |
| GET | /manager | Manager: events from managed clubs |
| GET | /member | Member: browse all events |
| POST | / | Create event (Manager) |
| PUT | /:id | Update event (Manager) |
| DELETE | /:id | Delete event (Manager) |

---

# 👔 Manager Routes (13)
**Base: `/api/dashboard/manager`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /overview | Manager dashboard summary |
| GET | /clubs | Manager’s clubs |
| POST | /clubs | Create club |
| PUT | /clubs/:id | Update club |
| DELETE | /clubs/:id | Delete club + cleanup |
| GET | /clubs/:id/members | Get club members |
| PATCH | /membership/:id/status | Update member status |
| GET | /events/:clubId | Events for club |
| POST | /events/:clubId | Create event |
| PUT | /events/edit/:id | Edit event |
| DELETE | /events/:id | Delete event |
| GET | /payments/:clubId | Get club payments |
| GET | /events/:eventId/registrations | Get registrations for event |

---

# 👤 Member Routes (4)
**Base: `/api/dashboard/member`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /overview | Overview (clubs joined, events, upcoming events) |
| GET | /my-clubs | Member’s clubs |
| GET | /my-events | Member’s event list |
| GET | /payments | Member payment history |

---

# 🧾 Membership Routes (5)
**Base: `/api/memberships`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Admin: all memberships |
| GET | /me | Logged-in user's memberships |
| POST | / | Create membership |
| PUT | /:id | Update membership |
| DELETE | /:id | Delete membership (Admin) |

---

# 💳 Payment Routes (6)
**Base: `/api/payments`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Create payment record |
| GET | / | Admin/Manager: all payments |
| GET | /my | Member's payments |
| POST | /stripe-session | Stripe Checkout session |
| POST | /webhook | Stripe Webhook handler |
| POST | /create-payment-intent | Payment Intent flow |

---

# 📦 Installation
```
npm install
```

# 🏁 Run the Server
Development:
```
npm run dev
```
Production:
```
npm start
```

---

##  Developer

**👤 Pritom Dey**  
📍 Bangladesh | CST, Sweden Polytechnic Institute  
 
📧 Email: `pritom1.2.zx@gmail.com`  


---

⭐ If you like this project, don’t forget to **star the repository** on GitHub!