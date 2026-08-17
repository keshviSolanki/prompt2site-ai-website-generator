# ⚡ Prompt2Site

> An AI-powered website generation platform that transforms natural language prompts into complete, modern websites using Generative AI.

## 🚀 Live Demo

### 🌐 Live Website

**[Visit Prompt2Site → ADD YOUR LIVE WEBSITE LINK HERE]**

### ⚙️ Backend API

**[Backend API → ADD YOUR BACKEND LIVE LINK HERE]**

### 🎥 Demo Video

**[Watch Demo → ADD YOUR DEMO VIDEO LINK HERE]**

---

## 📖 About The Project

**Prompt2Site** is an AI-powered website generation platform designed to make website development faster and easier.

Users can describe the website they want using a natural language prompt, and the AI processes the request to generate website content and structure.

The project combines **Generative AI with full-stack web development** to create an experience where users can build websites without manually writing every part of the application.

---

## ✨ Features

### 🤖 AI Website Generation

* Generate websites using natural language prompts
* AI-powered website structure generation
* Generate website content using LLMs
* Convert user requirements into website components
* AI-assisted development workflow

### 💬 AI Interaction

* Prompt-based interaction
* AI-generated responses
* Context-aware generation
* Multiple AI/LLM integration support
* AI fallback architecture

### 👤 Authentication

* User registration and login
* Secure authentication
* Protected routes
* User session management
* User profile management

### 🌐 Website Management

* Generate websites from prompts
* Save generated website data
* Manage generated projects
* Access previously generated websites
* Preview generated websites

### 🖼️ Image & Asset Management

* Image upload
* Cloudinary integration
* Cloud-based asset storage
* AI-generated website assets support

### 💳 SaaS & Subscription Features

* Premium features
* Credit-based usage
* Payment integration
* Razorpay integration
* User credit management

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose

### AI

* Generative AI
* Gemini API
* LLM-based website generation
* AI fallback architecture

### Authentication

* JWT
* HTTP-only Cookies
* Protected Routes

### Cloud Services

* Cloudinary
* MongoDB Atlas

### Payment

* Razorpay

### Development & Deployment

* Git
* GitHub
* Docker
* REST APIs

---

## 🏗️ System Architecture

```text id="5s8xqw"
                    User
                     │
                     ▼
              React Frontend
                     │
                     │ API Requests
                     ▼
              Node.js / Express
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
 Authentication   AI Service   Website Service
        │            │            │
        │            ▼            │
        │       Gemini / LLM      │
        │                         │
        ▼                         ▼
      MongoDB              Generated Websites
        │
        ├── Users
        ├── Projects
        ├── Websites
        └── Credits

External Services
        │
        ├── Cloudinary
        └── Razorpay
```

---

## 📂 Project Structure

```text id="b4myzn"
Prompt2Site/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── README.md
└── .gitignore
```

> Adjust the structure above according to your actual folder names.

---

## 🔄 How Prompt2Site Works

```text id="ym8gl7"
User enters a prompt
        │
        ▼
Frontend sends request
        │
        ▼
Backend validates request
        │
        ▼
AI / LLM processes prompt
        │
        ▼
Website structure & content generated
        │
        ▼
Generated data processed by backend
        │
        ▼
Website displayed to user
        │
        ▼
User can preview and manage website
```

---

## 💡 Example Prompt

A user can provide a prompt such as:

```text id="g0n8ac"
Create a modern portfolio website for a software developer
with a dark theme, animated hero section, skills section,
projects section, experience section and contact form.
```

Prompt2Site processes the request and uses AI to generate the required website structure and content.

---

## ⚙️ Environment Variables

Create a `.env` file in the backend directory.

```env id="t4k8ra"
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> Never commit your `.env` file or expose API keys and payment credentials publicly.

---

## 📥 Installation

Clone the repository:

```bash id="5ikzq6"
git clone https://github.com/YOUR_USERNAME/YOUR_PROMPT2SITE_REPOSITORY.git
```

Move into the project:

```bash id="6jz7pv"
cd Prompt2Site
```

Install frontend dependencies:

```bash id="g8xj1a"
cd frontend
npm install
```

Install backend dependencies:

```bash id="1r5f2f"
cd ../backend
npm install
```

Configure your environment variables.

Start the backend:

```bash id="7i2l4m"
npm run dev
```

Start the frontend in another terminal:

```bash id="2q5m9s"
cd frontend
npm run dev
```

---

## 🎯 Key Highlights

* 🤖 AI-powered website generation
* 💬 Natural language prompting
* 🧠 Generative AI integration
* 🔐 Secure authentication
* 💳 Credit/subscription system
* ☁️ Cloudinary asset management
* 🗄️ MongoDB database
* ⚡ MERN-based architecture
* 📱 Responsive web interface
* 🚀 Full-stack SaaS architecture

---

## 🎓 What I Learned

Through Prompt2Site, I gained practical experience in:

* Integrating Generative AI into full-stack applications
* Designing AI-powered application workflows
* Building REST APIs with Node.js and Express
* MongoDB database design
* JWT-based authentication
* Cloudinary integration
* Payment gateway integration
* Building SaaS-style applications
* Managing user credits and premium features
* Connecting frontend and backend services
* Deploying full-stack applications

---

## 🔮 Future Improvements

* More advanced AI website generation
* AI-powered code generation
* Live website editor
* Drag-and-drop customization
* Multiple website templates
* Custom domain support
* GitHub integration
* One-click website deployment
* More LLM providers
* AI-powered website modification
* Version history
* Collaborative website editing

---

## 👨‍💻 Author

### Keshvi Solanki

Full Stack Developer focused on building modern web applications and AI-powered products.

**GitHub:** https://prompt2site-ai-website-generator-1.onrender.com/

---

## ⭐ Support

If you find Prompt2Site interesting, consider giving the repository a ⭐ on GitHub.

Your support helps improve the project and encourages further development.
