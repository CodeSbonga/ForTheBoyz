# Overview

This is a full-stack Telkom-themed parental dashboard and gamified learning application built for a hackathon. The application provides comprehensive family internet management capabilities with two main components: a parental control dashboard for managing family member internet access and study modes, and a gamified learning interface for students. The system follows Telkom's blue-and-white branding and emphasizes educational content control, usage analytics, and family-friendly internet management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework Choice**: React with TypeScript using Vite as the build tool
- **Rationale**: Provides fast development with hot module replacement and excellent TypeScript support
- **UI Framework**: Radix UI components with shadcn/ui for consistent, accessible design
- **Styling**: Tailwind CSS with custom Telkom branding (blue/white theme)
- **State Management**: TanStack Query (React Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

## Backend Architecture

**Framework**: Express.js with TypeScript
- **Rationale**: Lightweight, flexible Node.js framework suitable for REST API development
- **Data Layer**: In-memory storage implementation (MemStorage) that follows IStorage interface
- **API Design**: RESTful endpoints for CRUD operations on family members, settings, whitelist sites, and usage reports
- **Validation**: Zod schemas shared between frontend and backend for consistent validation
- **Development Setup**: Custom Vite integration for seamless full-stack development

## Database Schema Design

**ORM**: Drizzle ORM with PostgreSQL dialect configured
- **Tables**:
  - `family_members`: Stores user profiles with roles (parent/student/adult), study progress, and status
  - `whitelist_sites`: Educational sites allowed during study mode
  - `blocked_apps`: Entertainment applications to restrict
  - `settings`: Global study mode configuration and schedules
  - `usage_reports`: Analytics data for family internet usage patterns

**Design Pattern**: Schema-first approach with TypeScript types generated from Drizzle schemas

## Component Architecture

**Design System**: Custom component library built on Radix UI primitives
- **Theming**: CSS custom properties for consistent color schemes and dark/light mode support
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Accessibility**: WCAG-compliant components with proper ARIA attributes
- **Reusability**: Modular components for dashboard widgets, forms, and data visualization

## Key Features Implementation

**Study Mode Management**: Toggle-based system with scheduled restrictions and break periods
**Family Member Management**: Role-based access control with different permissions for parents, students, and adults
**Content Filtering**: Whitelist/blacklist system for educational vs entertainment content
**Usage Analytics**: Mock data visualization for study time tracking and efficiency reporting
**Quick Actions**: Emergency controls for internet pausing and restriction management

# External Dependencies

## UI and Styling
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

## Data and State Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database provider (configured but not actively used in current implementation)

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

## Session Management
- **Connect-pg-simple**: PostgreSQL session store for Express sessions (configured for future authentication implementation)

The application is designed to be easily extensible with real database integration, authentication systems, and additional parental control features while maintaining the established architectural patterns and Telkom branding requirements.