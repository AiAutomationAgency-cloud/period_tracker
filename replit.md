# LifeCycle AI - Women's Health Companion

## Overview

LifeCycle AI is a comprehensive women's health tracking application that combines cycle monitoring, pregnancy tracking, wellness management, and AI-powered health insights. The application provides personalized health recommendations and allows users to track various aspects of their reproductive and general health through an intuitive web interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses a React-based single-page application (SPA) with the following key decisions:
- **React with TypeScript**: Chosen for type safety and better developer experience
- **Wouter for routing**: Lightweight alternative to React Router for client-side navigation
- **TanStack React Query**: Handles server state management, caching, and data synchronization
- **Radix UI + Tailwind CSS**: Component library with shadcn/ui for consistent, accessible UI components
- **Vite build system**: Fast development server and optimized production builds

### Backend Architecture
The server follows a REST API pattern built on Express.js:
- **Express.js server**: Lightweight Node.js framework for API endpoints
- **TypeScript throughout**: Ensures type safety across the entire stack
- **Mock storage layer**: Currently uses in-memory storage with interface for future database integration
- **Route organization**: Modular route handlers for different feature domains (cycles, symptoms, moods, etc.)

### Data Storage Strategy
The application uses a dual approach for data persistence:
- **PostgreSQL with Drizzle ORM**: Configured for production database operations with type-safe queries
- **Neon Database**: Cloud PostgreSQL provider for serverless database hosting
- **Schema-first design**: Shared TypeScript types between client and server using Drizzle schema
- **Mock storage interface**: Allows development without database dependency while maintaining production-ready architecture

### AI Integration
Google's Gemini AI is integrated for health insights and assistance:
- **Health insights generation**: Analyzes user data patterns to provide personalized recommendations
- **Interactive chat assistance**: Real-time health question answering
- **Structured response handling**: JSON-formatted AI responses for consistent data processing
- **Privacy-conscious design**: User data stays within the application context

### Authentication & Session Management
Currently uses a simplified approach suitable for development:
- **Mock user system**: Single hardcoded user for development and testing
- **Session handling**: Prepared infrastructure for future authentication implementation
- **User profile management**: Complete CRUD operations for user data

### Progressive Web App (PWA) Features
The application includes PWA capabilities:
- **Service worker**: Caching strategy for offline functionality
- **Web app manifest**: Native app-like installation and appearance
- **Push notifications**: Infrastructure for health reminders and alerts

### Component Architecture
Frontend components follow a hierarchical structure:
- **Layout components**: Global navigation and theme management
- **Feature-specific components**: Organized by domain (cycle, pregnancy, wellness, AI)
- **Shared UI components**: Reusable components from shadcn/ui library
- **Custom hooks**: Encapsulated logic for theme management and mobile detection

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Build tool and development server

### Database & ORM
- **Drizzle ORM**: Type-safe database queries and schema management
- **@neondatabase/serverless**: Serverless PostgreSQL database driver
- **PostgreSQL**: Primary database system (configured via DATABASE_URL)

### AI Services
- **@google/genai**: Google Gemini AI integration for health insights and chat functionality

### UI & Styling
- **@radix-ui/***: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe variant API for component styling
- **Lucide React**: Icon library for consistent iconography

### State Management & Data Fetching
- **@tanstack/react-query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema validation

### Development & Build Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing

### Additional Features
- **date-fns**: Date manipulation and formatting utilities
- **wouter**: Lightweight client-side routing
- **connect-pg-simple**: PostgreSQL session store (prepared for authentication)

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clear separation of concerns between frontend presentation, backend API logic, and data persistence layers.