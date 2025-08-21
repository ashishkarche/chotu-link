# ChotuLink

**ChotuLink** is a modern URL shortening platform designed to simplify link sharing and management. It provides both free and premium features, allowing users to shorten URLs quickly, track link analytics, and generate QR codes for easy access. The platform is responsive, secure, and user-friendly, suitable for individuals and businesses alike.

---

## Features

### Free Features
- Shorten long URLs instantly
- Copy shortened URLs with one click
- Access without registration

### Premium Features
- User dashboard displaying all shortened links
- Click analytics and link tracking
- Generate QR codes for links
- Manage and organize links efficiently

### General Features
- Responsive design using Bootstrap 5
- Smooth user experience with toast notifications
- Token-based authentication for secure access
- Alerts for expired or invalid sessions

---

## Technology Stack

- **Frontend:** React.js, Bootstrap 5, CSS3  
- **Backend:** Node.js, Express (API for URL shortening, authentication, link management)  
- **Database:** MongoDB or similar for storing user links and analytics  
- **QR Code Generation:** `qrcode.react` library  
- **Authentication:** JWT token-based system  

---

## Why ChotuLink?

ChotuLink addresses the need for a reliable, fast, and secure URL shortening service with additional benefits:

- Efficient URL shortening for free users  
- Advanced analytics and link tracking for premium users  
- QR code generation for easy link sharing  
- Modern, responsive, and intuitive interface  
- Security-focused with token-based authentication and session management  

---

## Setup and Installation

1. **Clone the repository**  
```bash
git clone https://github.com/ashishkarche/chotu-link.git 
```

2. **Install Dependencies**
```bash
cd chotu-link
npm install
```
3. **Run the development server**
```bash
npm start
```

4. **Open Open http://localhost:3000 in your browser to access the platform**