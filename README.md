# Visionsby_MON - Luxury Online Fashion Store

Visionsby_MON is an online clothing boutique featuring a decoupled architecture with a modern **Frontend Client** and a **Node.js / Express / MongoDB Backend Server**.

---

## 🌟 Key Features

- **Cash on Delivery (COD) Checkout**: Streamlined checkout workflow configured specifically for Cash on Delivery orders.
- **Dynamic Customer Receipts**: Instant email confirmation sent directly to the logged-in customer's email address upon checkout.
- **Store Owner Purchase Alerts**: Automated email notifications dispatched to the store owner (`STORE_OWNER_EMAIL`) detailing customer info, items, sizes, colors, and delivery address for every purchase.
- **Account Security & Validation**:
  - **Duplicate Email Prevention**: Checks existing user accounts first and blocks duplicate registrations with sign-in prompts.
  - **Password Strength Standards**: Enforces passwords of at least 8 characters with 1 uppercase letter and 1 special symbol (`!@#$%^&*`).
- **Inventory & Stock Management**: Real-time stock validation and reduction for catalog items.
- **Interactive UI**: Responsive clothing catalog, product modal preview with color & size selectors, customizer studio, wishlist, cart drawer, and user order history.

---

## 📂 Project Structure

```text
Visionsby_MON/
├── client/              # Frontend Web Application (Port 3000)
│   ├── index.html       # Store HTML Interface
│   ├── style.css        # Custom Styles & Responsive Layouts
│   ├── script.js        # Dynamic Application Logic & API Calls
│   ├── images/          # Product Photos & Assets
│   └── package.json     # Client Dependency Manifest
│
├── server/              # Backend REST API & Services (Port 5000)
│   ├── server.js        # Express Server & Route Controllers
│   ├── db.js            # Mongoose Schemas & MongoDB Connection
│   ├── services/
│   │   ├── emailService.js   # Customer & Owner Email Dispatcher
│   │   └── couponService.js  # Promo Code & Discount Manager
│   ├── .env             # Environment Configuration (Port, Database, SMTP)
│   └── package.json     # Server Dependency Manifest
│
├── package.json         # Root Monorepo Scripts
└── README.md            # Documentation
```

---

## 🚀 How to Run the Project

### Quick Start (Run Both Frontend & Backend)

Open your terminal in the root project folder:

```bash
# Install dependencies
npm install

# Start both backend (Port 5000) and frontend (Port 3000) concurrently
npm run dev
```

### Running Components Individually

**Backend Server (Port 5000)**:

```bash
cd server
npm install
npm run dev
```

**Frontend Client (Port 3000)**:

```bash
cd client
npm run dev
```

---

## ⚙️ Environment Configuration

Set up your SMTP and server variables in `server/.env`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key

# Store Owner Email for Purchase Notifications
STORE_OWNER_EMAIL=nitinmehra8834@gmail.com

# SMTP Transport Configuration (e.g. Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=nitinmehra8834@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=nitinmehra8834@gmail.com

# MongoDB Database URI
MONGODB_URI=your_mongodb_connection_string
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), FontAwesome Icons
- **Backend**: Node.js, Express.js, Nodemailer, JWT, Bcrypt
- **Database**: MongoDB Atlas / Mongoose ORM
