# Pathfinder - AI Career Mentorship Platform

## Overview

Pathfinder is a modern web application that serves as a Global Opportunity Engine and personal AI life architect. The platform transforms vague career aspirations into actionable, step-by-step learning paths while providing continuous, adaptive learning support throughout professional journeys. It leverages AI to democratize access to world-class career guidance, education, and global opportunities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animation**: Framer Motion for smooth UI transitions
- **Theme**: Dark/light mode support with custom theme provider

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful APIs with JSON responses
- **AI Integration**: Google Gemini AI (gemini-2.0-flash model) for career mentorship
- **Session Management**: Express sessions with PostgreSQL session store
- **CORS**: Enabled for cross-origin requests

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon serverless driver for PostgreSQL

## Key Components

### AI Mentorship System
- **Google Gemini Integration**: Uses gemini-2.0-flash model for conversational AI
- **Context-Aware Responses**: Maintains conversation history for personalized guidance
- **Career Path Generation**: AI-powered creation of learning paths based on user goals
- **Real-time Chat**: Interactive chat interface for immediate career guidance

### User Interface Components
- **Responsive Design**: Mobile-first approach with dedicated mobile components
- **Interactive Demos**: EnhancedDemo and InteractiveDemo components for user engagement
- **Component Library**: Comprehensive UI components (buttons, cards, forms, etc.)
- **Theme System**: Consistent design tokens and color schemes
- **Progressive Enhancement**: Graceful degradation for different device types

### Authentication & User Management
- **User Schema**: Basic user structure with username/password
- **Storage Layer**: Abstracted storage interface supporting both memory and database backends
- **Session Management**: Express sessions with PostgreSQL backing

## Data Flow

1. **User Interaction**: Users interact through React components
2. **API Layer**: Frontend communicates with Express.js backend via REST APIs
3. **AI Processing**: Career queries are processed by Google Gemini AI
4. **Database Operations**: User data and sessions stored in PostgreSQL via Drizzle ORM
5. **Response Delivery**: AI responses and data returned to frontend for display

## External Dependencies

### AI Services
- **Google Generative AI**: Primary AI service for career mentorship and path generation
- **API Key Management**: Hardcoded API key (should be moved to environment variables)

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection Management**: Environment variable-based database URL configuration

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety and better developer experience
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` starts development server with hot reloading
- **Production Build**: `npm run build` creates optimized production bundle
- **Type Checking**: `npm run check` validates TypeScript types
- **Database**: `npm run db:push` deploys database schema changes

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **AI API Key**: Currently hardcoded, should be moved to environment variables
- **Build Output**: Static assets built to `dist/public`, server bundle to `dist/index.js`

### Server Architecture
- **Single Server**: Express.js serves both API and static files
- **Production Mode**: NODE_ENV=production for optimized runtime
- **Error Handling**: Global error handler for API responses
- **Logging**: Request/response logging with timing information

### Key Architectural Decisions

1. **Full-Stack TypeScript**: Ensures type safety across frontend and backend
2. **Serverless Database**: Neon PostgreSQL for scalability without infrastructure management
3. **AI-First Design**: Google Gemini integration as core feature rather than addon
4. **Component-Based UI**: Modular, reusable components for maintainability
5. **Mobile-First**: Dedicated mobile components for optimal user experience
6. **Development Experience**: Vite and hot reloading for fast iteration cycles

The application follows modern web development practices with a focus on type safety, performance, and user experience. The AI integration is central to the platform's value proposition, providing personalized career guidance through conversational interfaces.

## Recent Changes:
- Updated hero section with user-provided video (https://streamable.com/peqv3j)
- Implemented advanced ML features including Predictive Career Forecaster and Personalized Pedagogy system
- Developed the "killer API" with multi-modal capabilities and web scraping powers
- Created comprehensive API endpoints for ML/AI features, pedagogy engine, and intelligence gathering
- Added fallback HTTP scraping when Puppeteer is unavailable
- Built advanced demo interface showcasing all killer API features
- Successfully completed all advanced features with real AI implementations (not mocks)
- Added advanced demo page to routing system for showcasing ML capabilities