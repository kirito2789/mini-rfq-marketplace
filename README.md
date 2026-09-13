# RFQHub — B2B RFQ Marketplace

A full-stack B2B procurement marketplace that connects **buyers with suppliers** through a structured Request for Quotation (RFQ) workflow.

Buyers can publish procurement requirements, suppliers can discover relevant RFQs and submit quotations, and buyers can compare and accept/reject supplier offers.

## 🚀 Live Demo

**Frontend:**
https://mini-rfq-marketplace.vercel.app/

**Backend API:**
https://mini-rfq-marketplace.onrender.com/

**API Health Check:**
https://mini-rfq-marketplace.onrender.com/health

---

## 📌 Project Overview

Traditional B2B procurement often involves manually searching for suppliers, sending individual enquiries, collecting quotations through email or messaging platforms, and comparing offers manually.

RFQHub provides a centralized workflow:

```text
Buyer
  ↓
Create RFQ
  ↓
RFQ Marketplace
  ↓
Suppliers discover opportunities
  ↓
Suppliers submit quotations
  ↓
Buyer compares quotations
  ↓
Accept / Reject quotation
  ↓
RFQ completed
```

The goal is to make B2B sourcing **faster, more structured and easier to manage**.

---

## ✨ Features

### 👤 Authentication

* Buyer and Supplier registration
* Login using email and password
* JWT-based authentication
* Password hashing using bcrypt
* Role-based authorization
* Protected routes

### 🏢 Buyer Features

* Buyer dashboard
* Create RFQs
* View personal RFQs
* View RFQ details
* View supplier quotations
* Compare supplier offers
* Accept quotations
* Reject quotations
* Automatically close an RFQ after accepting a quotation

### 🏭 Supplier Features

* Supplier marketplace
* Browse open RFQs
* View RFQ details
* Submit quotations
* Specify:

  * Unit price
  * Delivery days
  * Quotation validity
  * Tax
  * Shipping
  * Additional notes
* View submitted quotations
* Track quotation status

### 🔐 Security

* JWT authentication
* Password hashing
* Role-based access control
* Protected API endpoints
* Buyer ownership verification
* Supplier ownership verification
* Request validation using Zod
* CORS configuration

### 📊 Procurement Workflow

```text
OPEN RFQ
   ↓
Supplier quotations
   ↓
Buyer comparison
   ↓
Accept quotation
   ↓
Selected quotation → ACCEPTED
Other quotations   → REJECTED
RFQ                → CLOSED
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Lucide React
* Axios

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* Zod
* CORS
* dotenv

### Database

* PostgreSQL
* Prisma ORM

### Deployment

* Vercel — Frontend
* Render — Backend
* PostgreSQL — Database

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      RFQHub UI      │
                    │   React + Vite      │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │     Express API      │
                    │       Node.js        │
                    └──────────┬───────────┘
                               │
                     Prisma ORM│
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │      Database        │
                    └──────────────────────┘
```

---

## 📁 Project Structure

```text
mini-rfq-marketplace/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── rfqController.js
│   │   │   └── quotationController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── rfqRoutes.js
│   │   │   └── quotationRoutes.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── BuyerDashboard.jsx
│   │   │   ├── CreateRFQ.jsx
│   │   │   ├── RFQDetails.jsx
│   │   │   ├── BuyerQuotations.jsx
│   │   │   ├── SupplierMarketplace.jsx
│   │   │   ├── SupplierRFQDetails.jsx
│   │   │   └── SupplierQuotations.jsx
│   │   │
│   │   ├── styles/
│   │   │   └── global.css
│   │   │
│   │   ├── App.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── package configuration
```

---

# 🔑 User Roles

RFQHub supports two primary roles.

## Buyer

A buyer represents a company looking to purchase products or services.

Buyer workflow:

```text
Register
   ↓
Login
   ↓
Buyer Dashboard
   ↓
Create RFQ
   ↓
Receive quotations
   ↓
Compare quotations
   ↓
Accept / Reject
```

## Supplier

A supplier represents a company that wants to respond to procurement opportunities.

Supplier workflow:

```text
Register
   ↓
Login
   ↓
Supplier Marketplace
   ↓
Browse RFQs
   ↓
View RFQ
   ↓
Submit quotation
   ↓
Track quotation status
```

---

# 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM.

### User

```text
User
├── id
├── name
├── email
├── password
├── companyName
├── role
├── createdAt
└── updatedAt
```

Roles:

```text
BUYER
SUPPLIER
```

### RFQ

```text
RFQ
├── id
├── title
├── description
├── category
├── quantity
├── budget
├── deliveryDate
├── location
├── status
├── buyerId
├── createdAt
└── updatedAt
```

### Quotation

```text
Quotation
├── id
├── unitPrice
├── deliveryDays
├── validityDays
├── tax
├── shipping
├── notes
├── status
├── rfqId
├── supplierId
├── createdAt
└── updatedAt
```

---

# 🔌 API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## RFQs

### Create RFQ

```http
POST /api/rfqs
```

**Role:** Buyer

### Get My RFQs

```http
GET /api/rfqs/my
```

**Role:** Buyer

### Get Open RFQs

```http
GET /api/rfqs/open
```

**Role:** Supplier

### Get RFQ by ID

```http
GET /api/rfqs/:id
```

**Authentication:** Required

---

## Quotations

### Submit quotation

```http
POST /api/quotations
```

**Role:** Supplier

### Get supplier quotations

```http
GET /api/quotations/my
```

**Role:** Supplier

### Get quotations for an RFQ

```http
GET /api/quotations/rfq/:rfqId
```

**Role:** Buyer

### Accept quotation

```http
POST /api/quotations/:quotationId/accept
```

**Role:** Buyer

### Reject quotation

```http
POST /api/quotations/:quotationId/reject
```

**Role:** Buyer

---

# ⚙️ Local Development

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL
* Git

---

## 1. Clone the repository

```bash
git clone https://github.com/kirito2789/mini-rfq-marketplace.git

cd mini-rfq-marketplace
```

---

# 2. Backend Setup

Move into the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/rfqmarket?schema=public"
JWT_SECRET="your_jwt_secret"
PORT=5050
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Start backend:

```bash
npm run dev
```

Backend should run on:

```text
http://localhost:5050
```

Health check:

```text
http://localhost:5050/health
```

---

# 3. Frontend Setup

Open another terminal:

```bash
cd mini-rfq-marketplace/frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5050
```

Start frontend:

```bash
npm run dev
```

Frontend should run on:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

## Backend

```env
DATABASE_URL=
JWT_SECRET=
PORT=
FRONTEND_URL=
```

## Frontend

```env
VITE_API_URL=
```

Never commit `.env` files containing secrets.

Use `.env.example` when sharing environment configuration.

---

# 🧪 Example Workflow

You can test the complete application using two accounts.

### Buyer

```text
1. Register as BUYER
2. Login
3. Create an RFQ
4. Add product information
5. Publish RFQ
```

### Supplier

```text
1. Register as SUPPLIER
2. Login
3. Open Supplier Marketplace
4. Select the buyer's RFQ
5. Submit quotation
```

### Buyer

```text
1. Return to Buyer Dashboard
2. Open the RFQ
3. View supplier quotations
4. Compare offers
5. Accept or reject a quotation
```

---

# 📈 Future Roadmap

The current version focuses on the core RFQ marketplace workflow.

Potential future improvements include:

### Phase 1 — Marketplace Improvements

* Supplier search
* Advanced RFQ filtering
* Category-based discovery
* Supplier profiles
* Company verification
* Supplier ratings and reviews

### Phase 2 — Communication

* Buyer-supplier messaging
* Email notifications
* Real-time quotation notifications
* RFQ deadline reminders

### Phase 3 — Smart Procurement

* AI-based supplier matching
* AI quotation comparison
* Recommended suppliers
* Price benchmarking
* Historical procurement analytics

### Phase 4 — Business Platform

* Subscription plans
* Premium supplier listings
* Procurement analytics
* Enterprise accounts
* Team-based buyer accounts
* Advanced reporting

### Phase 5 — Payments & Transactions

* Online payments
* Purchase orders
* Invoices
* Escrow-based transactions
* Transaction history

---

# 💰 Potential Business Model

RFQHub can eventually operate as a B2B SaaS + marketplace.

Possible revenue streams:

```text
Supplier Premium Plans
        +
Featured Supplier Listings
        +
Buyer Enterprise Plans
        +
Transaction Fees
        +
Advanced Procurement Analytics
```

Example future pricing:

| Plan       | Target User       | Features                         |
| ---------- | ----------------- | -------------------------------- |
| Free       | Small businesses  | Basic RFQs                       |
| Pro        | Growing suppliers | More quotations + visibility     |
| Business   | SMEs              | Advanced procurement tools       |
| Enterprise | Large companies   | Teams + analytics + integrations |

---

# 🎯 Product Vision

The long-term vision is to build a digital procurement network where businesses can:

```text
Discover
   ↓
Request
   ↓
Compare
   ↓
Negotiate
   ↓
Purchase
   ↓
Track
```

Instead of managing procurement across emails, spreadsheets and messaging applications, businesses can manage the complete sourcing workflow through one platform.

---

# 📚 What This Project Demonstrates

This project demonstrates practical experience with:

* Full-stack application development
* REST API development
* React application architecture
* Express.js backend development
* PostgreSQL database design
* Prisma ORM
* Authentication and authorization
* JWT
* Password hashing
* Role-based access control
* API validation
* CRUD operations
* Relational database relationships
* Cloud deployment
* Vercel deployment
* Render deployment
* Git and GitHub
* Production environment configuration

---

# 🚀 Deployment

## Frontend

The React frontend is deployed using Vercel.

```text
https://mini-rfq-marketplace.vercel.app/
```

## Backend

The Express API is deployed using Render.

```text
https://mini-rfq-marketplace.onrender.com/
```

## Database

The backend uses PostgreSQL through Prisma ORM.

---

# 🤝 Contributing

Contributions, suggestions and improvements are welcome.

To contribute:

```bash
git clone https://github.com/kirito2789/mini-rfq-marketplace.git
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes and commit:

```bash
git add .
git commit -m "Add your feature"
```

Push the branch:

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📄 License

This project is currently intended as a portfolio / startup MVP project.

License can be added as the project moves toward public production use.

---

GitHub:

https://github.com/kirito2789

---

## ⭐ If you find this project useful

Give the repository a ⭐ on GitHub and feel free to explore the codebase.

**RFQHub — Find the right suppliers. Get better quotes.**
