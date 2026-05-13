# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Angular Commands
- `npm start` or `ng serve` - Start development server on http://localhost:4200
- `ng build` - Build the project for production (output in `dist/` directory)
- `ng build --watch --configuration development` - Build in watch mode for development
- `ng test` - Run unit tests via Karma
- `npm run serve:ssr:store-admin` - Serve the SSR version (requires build first)

### Code Generation
- `ng generate component component-name` - Generate new component
- `ng generate service service-name` - Generate new service
- `ng generate directive|pipe|guard|interface|enum|module` - Generate other Angular artifacts

## Project Architecture

### High-Level Structure
This is an Angular 18 e-commerce admin dashboard application for Ice Planet Store V2. The app follows a modular architecture with:

- **Dashboard Module**: Main ecommerce analytics and overview
- **Pages Module**: Feature-specific pages (ecommerce, users, invoices)
- **Authentication Module**: Login, signup, password management
- **Settings Module**: Account and system settings
- **Shared Services**: Common business logic and API communication

### Key Architectural Patterns

**Route Structure**: The app uses hierarchical routing with parent-child relationships:
- Root dashboard (`/`) - Protected by AuthGuard
- Feature modules with child routes (e.g., `/ecommerce-page/products`, `/users/details/:id`)
- Authentication routes (`/authentication/sign-in`)
- Settings and error handling routes

**State Management**: Uses Angular services with RxJS for state management:
- `AuthService` - User authentication and session management
- Feature services (`ProductService`, `OrderService`, etc.) - Business logic
- BehaviorSubject pattern for reactive state updates

**API Integration**: 
- Base URL configurable via `environment.base_url` (defaults to `http://localhost:3000/api/v1`)
- RESTful API communication through HttpClient
- JWT-based authentication with auto-logout functionality
- FormData for file uploads (product images, user avatars)

### Core Modules & Features

**Ecommerce Management**:
- Product CRUD operations with image upload
- Bundle/pricing management for products
- Category management
- Order tracking and details
- Seller management and analytics
- Delivery tracking
- Audit logging and review system

**User Management**:
- Customer list with pagination
- User detail views
- Profile management

**Authentication System**:
- JWT token management with auto-refresh
- Role-based access control
- Password reset functionality
- Session persistence via localStorage

### Technology Stack
- **Framework**: Angular 18 with TypeScript
- **UI**: Angular Material with custom SCSS theming
- **Charts**: ApexCharts via ng-apexcharts
- **Rich Text**: ngx-editor
- **File Upload**: @iplab/ngx-file-upload
- **Testing**: Jasmine + Karma
- **Deployment**: Firebase Hosting (configured in firebase.json)
- **SSR**: Angular Universal support

### Development Notes
- Uses SCSS for styling with global style files in src/
- Material Design theme with azure-blue preset
- Custom CSS utilities in _utilities.scss, _ui-kit.scss
- RemixIcon integration for icons
- Responsive design with mobile-first approach

### Environment Configuration
Development environment expects:
- Backend API running on `http://localhost:3000/api/v1`
- Paystack integration for payments (test key included)
- Firebase hosting for production deployments

### File Upload & Media
- Product images stored via FormData uploads
- User avatar management through auth service
- Public assets stored in `public/images/` directory
- Supports various image formats for products, users, and UI elements