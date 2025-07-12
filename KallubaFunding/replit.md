# replit.md

## Overview

This is a modern full-stack crowdfunding platform called "Kalluba" built with React, Express.js, and PostgreSQL. The application allows users to discover, browse, and support creative projects across various categories. It features a clean, modern UI with shadcn/ui components and is designed to be responsive and user-friendly.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### July 12, 2025 - Authentication System Implementation
- Added comprehensive authentication system with JWT tokens
- Created Login and Signup pages with Meta-themed design (#1877F2)
- Implemented AuthContext for global authentication state management
- Updated Navbar to show user status and logout functionality
- Added protected routes with RequireAuth component
- Created Discover page for project exploration
- Updated Home page CTA buttons to route correctly:
  - "Explore Projects" → `/discover`
  - "Start Your Project" → `/signup`
- Enhanced API client to include authentication headers
- Added bcrypt password hashing and JWT token generation
- Implemented user registration, login, and logout functionality

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API endpoints
- **Development**: Hot module replacement via Vite integration

### Database Schema
- **Users**: Profile information, authentication data
- **Categories**: Project categories with icons and metadata
- **Projects**: Main project data including funding goals, descriptions, and status
- **Rewards**: Reward tiers for project backers
- **Pledges**: User contributions to projects

## Key Components

### Frontend Components
- **Navbar**: Fixed navigation with search functionality and branding
- **ProjectCard**: Reusable project display component with funding progress
- **CategoryCard**: Category browsing with project counts
- **SearchBar**: Real-time search with suggestions
- **UI Components**: Complete shadcn/ui component library

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Route Handlers**: Category and project CRUD operations
- **Database Connection**: Neon PostgreSQL integration with connection pooling

### Data Models
- **Project Status**: DRAFT, LIVE, ENDED, FUNDED
- **User Profiles**: Name, email, bio, profile images
- **Categories**: Organized project classification system
- **Funding System**: Goals, pledges, rewards, and backer tracking

## Data Flow

1. **Client Requests**: React components make API calls via TanStack Query
2. **Route Processing**: Express routes handle incoming requests
3. **Data Layer**: Storage abstraction interfaces with Drizzle ORM
4. **Database Operations**: PostgreSQL via Neon serverless connection
5. **Response Handling**: JSON responses with error handling
6. **Client Updates**: React Query manages cache updates and UI refreshes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection via Neon
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **@radix-ui/***: UI component primitives

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast TypeScript compilation
- **Tailwind CSS**: Utility-first styling

### UI Framework
- **shadcn/ui**: Pre-built component library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild compiles TypeScript server to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection for development/production
- **Build Output**: Separate client and server bundles

### Development Workflow
- **dev**: Runs development server with hot reload
- **build**: Creates production builds for both client and server
- **start**: Runs production server
- **db:push**: Applies database schema changes

The application uses a monorepo structure with shared TypeScript definitions and clear separation between client, server, and shared code. The architecture supports scalable development with type safety throughout the stack.