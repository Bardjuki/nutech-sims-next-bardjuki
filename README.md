# SIMS PPOB - AHMAD BARDJUKI SANTOSO

A modern and responsive frontend application for SIMS PPOB (Payment Point Online Bank) built with Next.js and React.js framework.

![SIMS PPOB Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=SIMS+PPOB+Application)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

SIMS PPOB is a comprehensive payment and transaction management application designed as an Assignment for Front End Web Programmer position. The application provides a seamless user experience for managing digital payments, top-ups, and transaction history with a modern and intuitive interface.

## ✨ Features

### 1. **User Authentication**
- **Registration**: New users can create an account with email verification
- **Login**: Secure login system with JWT token authentication
- **Session Management**: Automatic session handling and token refresh

### 2. **Profile Management**
- **View Profile**: Display user information and account details
- **Update Profile Data**: Edit personal information (name, email, phone number)
- **Update Profile Picture**: Upload and change profile photo with image preview

### 3. **Financial Operations**
- **Top Up**: Add balance to your account with multiple payment methods
- **Payment**: Process payments for various services and bills
- **Transaction History**: View complete transaction records with filters and pagination

### 4. **User Interface**
- Responsive design for mobile, tablet, and desktop
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback

## 🛠 Tech Stack

### Core Framework
- **Next.js 15.5.6** - React framework with server-side rendering, routing, and Turbopack support
- **React.js 19.1.0** - Latest component-based UI library
- **TypeScript 5** - Type safety and enhanced developer experience

### Styling
- **Tailwind CSS 4** - Latest version of utility-first CSS framework
- **PostCSS** - CSS processing with @tailwindcss/postcss

### State Management
- **Redux Toolkit 2.9.1** - Modern Redux development with simplified API
- **React Redux 9.2.0** - Official React bindings for Redux

### HTTP Client
- **Axios 1.12.2** - Promise-based HTTP client for API requests
- **Axios Interceptors** - Request/response interceptors for authentication

### UI Components & Icons
- **Lucide React 0.546.0** - Beautiful and consistent icon library with 1000+ icons
- **Framer Motion 12.23.24** - Production-ready animation library for React

### Development Tools
- **TypeScript 5** - Static typing for improved code quality
- **ESLint 9** - Latest code linting with Next.js configuration
- **Turbopack** - Next-generation bundler for faster development builds

### Deployment
- **Vercel** - Serverless deployment platform optimized for Next.js

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.0.0 or higher) - Required for Next.js 15+
- **npm** (v10.0.0 or higher) or **yarn** (v1.22.0 or higher) or **pnpm** (v8.0.0 or higher)
- **Git** for version control

> **Note**: Next.js 15 requires Node.js 20 or later for optimal performance and compatibility.

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/sims-ppob.git
cd sims-ppob
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### Step 3: Install Required Packages

The following packages will be installed automatically:

```json
{
  "name": "nutech-sims-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.9.1",
    "axios": "^1.12.2",
    "framer-motion": "^12.23.24",
    "lucide-react": "^0.546.0",
    "next": "15.5.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-redux": "^9.2.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

> **Turbopack**: This project uses Turbopack for faster development and build times. Turbopack is the next-generation bundler built into Next.js 15.

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api-doc-tht.nutech-integrasi.com

# Application Configuration
NEXT_PUBLIC_APP_NAME=SIMS PPOB
NEXT_PUBLIC_APP_VERSION=1.0.0

## 🎮 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will run with **Turbopack** enabled for faster builds and hot module replacement (HMR).

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
```

> **Note**: Production builds also use Turbopack for optimized compilation.

### Linting

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## 📁 Project Structure

```
nutech-sims-next/
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── illustrations/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx
│   │   │   ├── topup/
│   │   │   │   └── page.tsx
│   │   │   ├── payment/
│   │   │   │   └── [serviceCode]/
│   │   │   │       └── page.tsx
│   │   │   ├── transaction/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── features/
│   │       ├── auth/
│   │       ├── profile/
│   │       ├── transaction/
│   │       └── balance/
│   ├── lib/
│   │   ├── axios/
│   │   │   └── config.ts
│   │   ├── redux/
│   │   │   ├── store.ts
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── balanceSlice.ts
│   │   │   │   └── transactionSlice.ts
│   │   │   └── hooks.ts
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── validators.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBalance.ts
│   │   └── useTransaction.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── transaction.ts
│   │   └── api.ts
│   └── styles/
├── .env.local
├── .eslintrc.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🔌 API Integration

### Base URL
```
https://take-home-test-api.nutech-integrasi.com
```

### API Documentation
Complete API documentation is available at:
[https://api-doc-tht.nutech-integrasi.com](https://api-doc-tht.nutech-integrasi.com)

### Key Endpoints

#### Authentication
- `POST /registration` - User registration
- `POST /login` - User login

#### Profile
- `GET /profile` - Get user profile
- `PUT /profile/update` - Update profile data
- `PUT /profile/image` - Update profile picture

#### Transactions
- `GET /balance` - Get current balance
- `POST /topup` - Top up balance
- `POST /transaction` - Process payment
- `GET /transaction/history` - Get transaction history

### Axios Configuration Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🚀 Deployment

### Deploy to Vercel

1. **Connect Repository**
   - Push your code to GitHub
   - Visit [Vercel](https://vercel.com)
   - Import your repository

2. **Configure Environment Variables**
   - Add all environment variables from `.env.local`
   - Set `NEXT_PUBLIC_API_BASE_URL`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Manual Deployment

```bash
# Build the application
npm run build

# The build output will be in the .next folder
# Deploy the .next folder to your hosting provider
```

## 🎨 Features in Detail

### Redux State Management

The application uses Redux Toolkit for centralized state management with the following structure:

```javascript
// Store structure
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  },
  balance: {
    amount: 0,
    loading: false,
    error: null
  },
  transactions: {
    list: [],
    pagination: {
      offset: 0,
      limit: 5
    },
    loading: false,
    error: null
  },
  profile: {
    data: null,
    loading: false,
    error: null
  }
}
```

### TypeScript Integration

The project is configured with TypeScript for type safety:

```typescript
// Example: Type-safe API response
interface User {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
```

### Framer Motion Animations

```javascript
// Example: Page transition
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### Tailwind CSS Utilities

The application uses Tailwind's utility classes for:
- Responsive design: `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Flexbox and Grid layouts
- Spacing and typography
- Custom color schemes
- Hover and focus states

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created as an assignment for Front End Web Programmer position.

## 👤 Author

**Ahmad Bardjuki Santoso**

- GitHub: [@bardjuki](https://github.com/Bardjuki)
- Email:ahmadbardjukis@gmail.com

## 🙏 Acknowledgments

- SIMS PPOB API by Nutech Integrasi
- Next.js team for the amazing framework
- Open source community for the tools and libraries

---

**Made with ❤️ by Ahmad Bardjuki Santoso**

For questions or support, please open an issue in the repository.