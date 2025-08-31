# 🛒 AI-Powered E-commerce Platform

A full-stack, **microservices-based e-commerce application** designed to deliver a modern, intelligent, and personalized shopping experience. The platform integrates AI-powered tools like personalized product recommendations, visual search, and sentiment analysis, making shopping engaging and dynamic.

---

## 🚀 Features

### 🛍️ Core E-commerce Functionality
- **Product Catalog**: Browse a large, dynamic catalog of products populated from a real-world dataset.
- **User Authentication**: Secure registration & login using **JWT tokens** and **bcrypt password hashing**.
- **Shopping Cart**: State-managed cart with **Redux** for a seamless experience.
- **Checkout Flow**: Multi-step process for shipping, payment, and order placement.
- **User Profiles & Order History**: Manage profile and view past orders.
- **Customer Reviews**: Ratings & written reviews for products.

### 🧠 Artificial Intelligence & Machine Learning
- **Content-Based Recommendations**: A "You Might Also Like" section powered by **Scikit-learn TF-IDF** model.
- **Visual Search**: Upload an image to find visually similar items using **ResNet50**.
- **Sentiment Analysis**: Analyze reviews using **Hugging Face Transformers**, displaying an aggregate **Positivity Score** for each product.

### 👑 Admin Portal
- **Secure Admin Access**: Admin-only portal with protected routes.
- **Dashboard**: Overview of users, orders, and revenue.
- **Product Management (CRUD)**: Create, update, and delete products.
- **User Management**: View registered users.
- **Review Management**: Moderate or delete user reviews.

---

## 🏛️ Architecture
The application uses a **microservices architecture**:

```
+------------------+      (API Calls)     +--------------------------------+      (SQL)      +-------------------+
|                  |--------------------->|                                |---------------->|                   |
|  React Frontend  |                      |  Node.js API (Core E-commerce) |                 |  PostgreSQL (Neon) |
| (Customer & Admin UI) |                      | (Users, Products, Orders)      |                 | (Structured Data) |
|                  |<---------------------|                                |                 |                   |
+------------------+      (JSON Data)      +--------------------------------+                 +-------------------+
        |                                                 |
        | (Image Uploads & AI Requests)                   | (Fetches data for models)
        '-----------------------+-------------------------'
                                |
                                v
                      +------------------------+
                      |                        |
                      |  Python API (AI/ML)    |
                      | (Flask, TF, Scikit)    |
                      |                        |
                      +------------------------+
```

---

## 🛠️ Technology Stack

| Category        | Technology |
|-----------------|------------|
| **Frontend**    | React.js, Redux, React Router, Axios, CSS Modules |
| **Core Backend**| Node.js, Express.js, PostgreSQL (Neon), JWT, Bcrypt.js |
| **AI Service**  | Python, Flask, TensorFlow, Scikit-learn, Pandas, Hugging Face Transformers |

---

## ⚙️ Getting Started

### ✅ Prerequisites
- Node.js & npm (or Yarn)
- Python 3.9+
- PostgreSQL Neon account

### 1️⃣ Database Setup
1. Create a new project on **Neon**.
2. Copy your connection string (e.g., `postgresql://user:password@host/dbname`).
3. Connect with `psql` or DBeaver.
4. Run the SQL script from **db_schema.sql** to create necessary tables.

### 2️⃣ Environment Configuration

**File: backend-main/.env**
```env
PORT=5001
DATABASE_URL="YOUR_NEON_DATABASE_CONNECTION_STRING"
JWT_SECRET="averylongandsupersecretstring"
AI_API_URL="http://127.0.0.1:5002"
```

**File: backend-ai/.env**
```env
DATABASE_URL="YOUR_NEON_DATABASE_CONNECTION_STRING"
```

Replace placeholders with your actual credentials.

### 3️⃣ Backend Installation
**Core API (Node.js):**
```bash
cd backend-main
npm install
```

**AI API (Python):**
```bash
cd backend-ai
pip install -r requirements.txt
```

### 4️⃣ Frontend Installation
```bash
cd frontend
yarn install   # or npm install
```

### 5️⃣ Data Population & AI Model Training
1. Download **Amazon Products Dataset** from Kaggle.
2. Extract and rename to `data_fashion.csv`, place inside `backend-ai/`.
3. Populate DB:
```bash
cd backend-ai
python populate_db.py
```
4. Extract features (downloads images & preprocesses):
```bash
python utils/image_feature_extractor.py
```

⏳ This may take 10–20+ minutes.

### 6️⃣ Running the Application
Run each service in separate terminals:

**Backend (Node.js):**
```bash
cd backend-main
npm start
```

**AI Backend (Python):**
```bash
cd backend-ai
python app.py
```

**Frontend (React):**
```bash
cd frontend
yarn start
```

Now open: **http://localhost:3000** 🎉

---

## 📘 Usage Guide

### 👑 Creating an Admin User
1. Register normally via **Sign Up**.
2. In Neon DB, run:
```sql
UPDATE users SET is_admin = true WHERE email = 'your_admin_email@example.com';
```
3. Log in again to access **Admin Portal**.

### 🤖 Testing AI Features
- **Recommendations**: Visit a product page → "You Might Also Like" section.
- **Sentiment Analysis**: Submit a review → Product’s **Positivity Score** updates.
- **Image Search**: Upload an image → Similar products are suggested.

---

## 📌 Future Improvements
- Deploy backend services on **Docker & Kubernetes**.
- Add **GraphQL API Gateway** for unified data access.
- Implement **real-time order tracking** with WebSockets.
- Enhance recommendation engine with **hybrid (collaborative + content-based)** filtering.

---

## 🤝 Contributing
1. Fork the repo.
2. Create a new branch (`feature/awesome-feature`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to branch (`git push origin feature/awesome-feature`).
5. Create a Pull Request.

---




