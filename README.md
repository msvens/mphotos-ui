# MPhotos UI

A modern photo blog frontend application built with Next.js, inspired by [mellowtech.org](https://www.mellowtech.org). This application serves as the user interface for a photo blog system, connecting to a backend service through a RESTful API.

## Overview

MPhotos UI is designed to provide a clean and elegant way to showcase photographs with blog-style presentation. The frontend communicates with a dedicated backend service to manage and display photo content.

## User Roles and Authentication Model

MPhotos UI operates with a **single-owner, multi-guest** authentication model:

### **Owner/Admin User (Single User)**
- **One primary user** owns and administers the entire photo blog
- **Authentication required** for administrative functions
- **Password-based login** (no username needed)
- **Full administrative access** including:
  - Profile management (name, bio, profile picture)
  - UX configuration (grid layout, spacing, theme preferences)
  - Google Drive integration settings
  - Content management (photos, albums, cameras)
  - Guest user management and moderation

### **Guest Users (Multiple Users)**
- **Public registration** available to anyone
- **Email verification required** for activation
- **Social interaction features** including:
  - Photo comments and likes
  - Guest profile management
  - Activity tracking
- **No administrative access** - read-only for site configuration
- **Separate authentication system** from owner login

### **Authentication Flow**
1. **Owner Login**: Password-based authentication for administrative access
2. **Guest Registration**: Email-based registration with verification
3. **Session Management**: Server-side sessions with automatic cookie handling
4. **Role-Based Access**: Different UI and functionality based on user type

This model ensures that the photo blog remains under the owner's control while allowing public interaction through guest accounts.

> **Current Implementation Status**: The owner authentication system (login/logout, profile management, UX configuration) is fully implemented. Guest user functionality (registration, comments, likes) is planned for future development.

## Navigation Structure

The application features a toolbar with five main navigation sections:

1. **Home** - Dynamic grid layout of photo thumbnails with infinite scroll functionality. Features:
   - Configurable grid layout
   - Lazy loading of images as you scroll
   - Thumbnail optimization
   - Direct navigation to full photo view on click
   - Admin controls for grid configuration
2. **Photo** - Detailed single photo view featuring:
   - Full-width photo display with optimal resolution
   - Photo metadata (camera settings, date, location)
   - Navigation between photos (previous/next)
   - Description and title
   - Download options
   - Responsive image sizing
   - Admin editing of photo metadata and details
3. **Album** - Organized photo collections featuring:
   - Overview of all albums with cover images
   - Album metadata (title, date, description)
   - Album-specific photo grid on selection
   - Navigation within album context
   - Consistent grid layout with Home view
   - Album-specific photo viewing
   - Admin controls for album management
4. **Camera** - Photography equipment showcase featuring:
   - Sidebar navigation of available cameras
   - Detailed camera specifications and descriptions
   - Camera usage statistics
   - Sample photos taken with each camera
   - Technical specifications
   - Personal experiences and reviews
   - Admin controls for camera information
5. **Guest** - Guest user registration and social interaction featuring:
   - Guest registration and email verification
   - Social features activation
   - Comment functionality on photos
   - Like/favorite capabilities
   - Guest profile management
   - Activity tracking and history
   - Separate from admin authentication system

## Features (Planned)

- Modern, responsive photo gallery
- Dynamic grid layout with configurable columns/spacing
- Infinite scroll with optimized image loading
- Thumbnail generation and caching
- Blog-style photo posts with descriptions
- Full-screen photo viewing experience
- EXIF data display (aperture, shutter speed, ISO, etc.)
- Photo navigation with keyboard controls
- High-resolution image support
- Album organization and management
- Album-specific navigation and context
- Album cover image selection
- Hierarchical photo browsing (Albums → Photos)
- Comprehensive camera equipment tracking
- Camera usage analytics and statistics
- Camera-specific photo galleries
- Detailed equipment specifications
- Social interaction features:
  - Photo comments
  - Like/favorite system
  - Guest profiles
  - Activity tracking
- User authentication and management
- Integration with RESTful backend API
- Clean and minimalist user interface
- Photo metadata display
- Image optimization and lazy loading
- Responsive design for all devices
- Organized photo collections through albums
- Guest access management

## Owner/Admin Features

*These features are only available to the authenticated owner/admin user:*

### Site Configuration
- Grid layout customization (columns, spacing, sizes)
- Theme and styling preferences
- Homepage layout settings
- Navigation options

### Content Management
- Photo upload and organization
- Album creation and management
- Photo metadata editing
- Camera equipment documentation
- Guest access control

### User Management
- Owner authentication
- Guest approval and management
- Comment moderation
- User activity monitoring

### System Settings
- Google Drive integration configuration
- Image processing settings
- Cache management
- Performance optimization

## Guest Features

*These features are available to registered guest users:*

### Social Interaction
- Photo commenting and discussion
- Like/favorite photo functionality
- Guest profile creation and management
- Activity history and tracking

### Content Access
- View all public photos and albums
- Access to camera equipment information
- Read-only access to site content
- Personalized guest experience

### Guest Management
- Self-service registration and verification
- Profile customization
- Privacy settings and preferences

## API Integration

The application connects to a backend service through RESTful APIs for:

### Photo Management
- Photo retrieval and listing
- Photo metadata updates (title, description, keywords)
- Photo album associations
- Local photo uploads
- Google Drive photo integration

### Album Management
- Album CRUD operations
- Album photo ordering
- Album metadata management
- Cover image handling

### Camera Equipment
- Camera information management
- Camera image uploads
- Camera metadata updates
- Usage statistics tracking

### User & Guest Management
- Guest registration and verification
- User profile management
- User configuration updates
- Profile picture management

### Configuration
- UX configuration management
- Drive folder configuration
- System settings

### Admin Operations
- Site configuration management
- Content moderation
- User management
- System settings control
- Performance monitoring

The complete API service is modeled after [mphotos-web service implementation](https://github.com/msvens/mphotos-web/tree/master/src/service).

## Technical Stack

- [Next.js](https://nextjs.org) - React framework for production
- Modern React practices with TypeScript
- [Tailwind CSS](https://tailwindcss.com) for styling and components
- Custom components inspired by Material Design principles
- Dark theme implementation using Tailwind's dark mode utilities
- Responsive design components using Tailwind's utility classes
- Dynamic grid system with virtualization
- Image optimization and caching strategy
- Advanced image loading and display techniques
- Context-aware navigation system
- Two-panel layout system
- Authentication and user management
- RESTful API integration with TypeScript service layer
- Comprehensive API client implementation

## UI Theme

The application features a sophisticated dark theme designed for optimal photo viewing:

### Design System
- Material Design inspired aesthetics
- Custom component design system
- Consistent styling patterns
- Modern, minimalist aesthetic

### Color Palette
- Material Design inspired color system
- Dark background for enhanced photo contrast
- Carefully selected accent colors for UI elements
- Optimized text contrast for readability
- Photo-centric color schemes

### Dark Mode Implementation
- Tailwind CSS dark mode utilities
- Consistent dark theme across all components
- Optimized for OLED displays
- Reduced eye strain for extended viewing

### UI Components
- Custom components following Material Design principles
- Dark-themed navigation and toolbars
- Photo-optimized viewing backgrounds
- Contrast-aware typography
- Dark-mode optimized icons and graphics
- Tailwind-based component system

## UI Spacing System

The application uses a consistent spacing system to maintain visual hierarchy and rhythm throughout the interface. The spacing system is implemented through the `Section` component and follows these principles:

### Section Component

The `Section` component provides consistent vertical spacing between major content blocks. It accepts the following props:

- `spacing`: Controls the vertical margin between sections
  - `sm`: 2rem (32px)
  - `md`: 4rem (64px)
  - `lg`: 6rem (96px)
  - `xl`: 8rem (128px)
- `showDivider`: Optional boolean to add a divider line after the section
- `className`: Additional CSS classes for custom styling

### Usage Guidelines

1. **Top-Level Spacing**
   - The main content area starts with a fixed top margin from the navbar (96px)
   - This is handled by the `LayoutProvider` component

2. **Section Spacing**
   - Use the `Section` component to wrap major content blocks
   - Choose spacing based on content hierarchy:
     - `lg` for primary sections (e.g., Bio, PhotoGrid)
     - `md` for secondary sections (e.g., controls, filters)
     - `sm` for compact sections
     - `xl` for hero sections or major page breaks

3. **Component-Level Spacing**
   - Components should handle their internal spacing using Tailwind's spacing utilities
   - Avoid using margin utilities on components that are wrapped in `Section`

### Example

```tsx
<Section spacing="lg" showDivider>
  <Bio />
</Section>

<Section spacing="md">
  <Controls />
</Section>

<Section spacing="lg">
  <PhotoGrid />
</Section>
```

This system ensures consistent vertical rhythm throughout the application while maintaining flexibility for different content types and hierarchies.

## Known Issues / Technical Debt

### Z-Index Stacking Context Issue

The edit controls in `PhotoDeck.tsx` currently have no `z-index` to avoid a stacking context conflict with the toast notification system.

**Background:** Fixed positioned elements with `z-index` create new stacking contexts. When the edit controls had `z-10`, the toast (with `z-[9999]`) couldn't appear above them due to DOM order - sibling stacking contexts compete by DOM order, not z-index values.

**Current workaround:** Removed `z-index` from edit controls.

**TODO:** Implement a proper z-index management system (e.g., CSS custom properties or a z-index scale) to handle overlapping fixed elements consistently across the app.

**Files affected:**
- `src/components/photodeck/PhotoDeck.tsx` - Edit controls
- `src/context/ToastContext.tsx` - Toast container

---

## Getting Started

This project uses **Yarn** as the package manager. Make sure you have Yarn installed:

```bash
npm install -g yarn
```

Then install dependencies and run the development server:

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> **Note:** This project uses Yarn exclusively. Please do not use npm or pnpm to avoid lock file conflicts.

## Development

This project uses:
- TypeScript for type safety
- Modern React patterns and hooks
- Next.js 14 features including app router
- [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for optimized font loading
- Tailwind CSS for utility-first styling
- Custom components inspired by Material Design

## Deployment

The application can be deployed using:
- [Vercel Platform](https://vercel.com) (recommended for Next.js)
- Traditional hosting with Node.js
- Docker containers

## Contributing

This is a personal project but suggestions and feedback are welcome.

## License

[Add your preferred license]
