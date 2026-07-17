# PROJECT_BRAIN - Helix Website Documentation

## Project Overview

**Project Name**: Helix - Tech & AI Club Website  
**Institution**: RVS College of Engineering and Technology (RVSCET), Jamshedpur  
**Club Founded**: January 9th, 2025  
**Website Purpose**: Official website for Helix, the Tech & AI club at RVSCET, showcasing the club's activities, events, team, and achievements.

---

## Technology Stack

### Core Framework
- **React**: 19.2.6 - UI library with React Compiler enabled for performance optimization
- **Vite**: 8.0.12 - Build tool and development server
- **React Router DOM**: 7.15.1 - Client-side routing

### Styling & UI
- **TailwindCSS**: 4.3.0 - Utility-first CSS framework with Vite integration
- **CSS Modules**: Custom styles in `/src/styles` directory

### Animation & Interactions
- **GSAP**: 3.15.0 - Professional animation library
- **@gsap/react**: 2.1.2 - React integration for GSAP
- **Lenis**: 1.3.23 - Smooth scrolling library

### Utilities
- **html-to-image**: 1.11.13 - Image generation from DOM elements

### Development Tools
- **ESLint**: 10.3.0 - Code linting
- **Babel**: 7.29.0 - JavaScript compiler with React Compiler preset
- **@vitejs/plugin-react**: 6.0.1 - Vite plugin for React

---

## Project Structure

```
helixWebsite/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CursorDot.jsx   # Custom cursor with morphing effects
│   │   ├── Loader.jsx      # Initial loading animation
│   │   ├── StringPluck.jsx # String animation effect
│   │   └── navbar/         # Navigation components
│   │       ├── Navbar.jsx  # Main navigation bar
│   │       └── MobileMenu.jsx
│   ├── sections/           # Page sections
│   │   ├── Hero.jsx        # Landing hero section
│   │   ├── About.jsx       # About section with vision/mission
│   │   ├── Events/         # Events display
│   │   │   ├── EventSection.jsx
│   │   │   └── eventList.js
│   │   ├── TeamsV2.jsx     # Team member showcase
│   │   ├── HallOfFame.jsx  # Achievements display
│   │   ├── Partnerships.jsx # Partner organizations
│   │   ├── Testimonials.jsx # Member testimonials
│   │   ├── ImageGallery/   # Photo gallery
│   │   ├── Footer.jsx      # Site footer
│   │   └── [other sections]
│   ├── pages/              # Page components
│   │   └── Home.jsx        # Main home page
│   ├── layouts/            # Layout components
│   │   └── MainLayout.jsx  # Main layout wrapper
│   ├── context/            # React context
│   │   └── CursorContext.jsx # Cursor state management
│   ├── styles/             # CSS files
│   │   ├── index.css      # Main stylesheet
│   │   ├── theme.css      # Theme variables
│   │   ├── typography.css # Typography styles
│   │   └── reset.css      # CSS reset
│   ├── assets/             # Static assets
│   │   ├── logo/          # Logo files
│   │   ├── fonts/         # Custom fonts
│   │   └── [event images]
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Application entry point
├── public/                 # Public assets
│   ├── favicon.svg
│   ├── icons.svg
│   ├── robots.txt
│   └── sitemap.xml
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── eslint.config.js        # ESLint configuration
└── README.md              # Project readme
```

---

## Key Features & Components

### 1. Custom Cursor System
- **Component**: `CursorDot.jsx`
- **Features**:
  - Morphing shape effects based on hover state
  - Smooth movement with GSAP ticker
  - Dynamic scaling based on mouse velocity
  - Context-based variant management
  - Image preview on specific hover states
- **Performance**: Uses `gsap.quickSetter` for optimized updates without re-renders

### 2. Navigation System
- **Component**: `Navbar.jsx`
- **Features**:
  - Scroll-based hide/show animation
  - Smooth reveal animations on load
  - Responsive design
  - Hover effects on navigation links
  - Logo with icon and text

### 3. Hero Section
- **Component**: `Hero.jsx`
- **Features**:
  - GSAP SplitText for character-by-character animation
  - Wave animation with color transitions
  - Scroll-triggered reveals
  - Responsive typography
  - Performance-optimized with proper cleanup

### 4. About Section
- **Component**: `About.jsx`
- **Features**:
  - Horizontal scrolling for purpose panels
  - 3D magnetic card effects for vision/mission
  - Ambient background blobs
  - Accessible glow text effects
  - Scroll-triggered animations

### 5. Events Display
- **Component**: `EventSection.jsx`
- **Features**:
  - 3D cylinder arrangement of event cards
  - Scroll-based rotation and translation
  - Card flip effects on hover
  - Mouse-based camera tilt parallax
  - Responsive card density (mobile vs desktop)

### 6. Team Showcase
- **Component**: `TeamsV2.jsx`
- **Features**:
  - Text split animations with hover effects
  - Image parallax effects
  - Clip-path reveals
  - Responsive layout
  - Social media integration

### 7. Loading System
- **Component**: `Loader.jsx`
- **Features**:
  - Initial loading animation
  - Completion callback for main content reveal
  - Smooth transition to main content

---

## Animation Strategy

### GSAP Implementation
- **Plugins Used**: ScrollTrigger, SplitText
- **Performance Optimizations**:
  - `force3D: true` for GPU acceleration
  - `will-change-transform` for paint optimization
  - Proper cleanup of SplitText instances
  - `gsap.quickSetter` for high-frequency updates
  - Context-scoped animations with `useGSAP`

### Scroll Animations
- **ScrollTrigger**: Used for scroll-based animations
- **Pin Effects**: Used for sections like Events cylinder
- **Scrub Effects**: Smooth scroll-linked animations
- **Batch Processing**: Efficient handling of multiple elements

### Performance Considerations
- Lazy loading of components below the fold
- Image lazy loading with `loading="lazy"`
- Proper cleanup in useEffect hooks
- GPU-accelerated transforms
- Optimized re-render strategies

---

## Content & Data

### Club Information
- **Name**: Helix - Tech & AI Club
- **Founded**: January 9th, 2025
- **Institution**: RVS College of Engineering and Technology, Jamshedpur
- **Focus Areas**: Web Development, Cybersecurity, AI, Robotics, UX Design

### Key Events (2025-2026)
1. **Club Orientation** - January 27th, 2025
2. **SDE Workshop** - February 19th, 2025 (Speaker: Pratik K Tiwari, Microsoft)
3. **Club Induction** - August 29th, 2025
4. **DevSpark** - September 4th, 2025 (Pre-DevFest event)
5. **SIH Internal Hackathon** - September 22nd, 2025
6. **AI Workshop at RVS Academy** - September 24th, 2025
7. **HackQubit** - October 7th & 8th, 2025 (24-hour national hackathon)
8. **DevFest Ranchi 2025** - October 11th, 2025
9. **RanchiHacks 2026** - January 17th & 18th, 2026
10. **NPTEL Awareness Workshop** - January 22nd, 2026

### Leadership Team
- **President**: Satish Verma
- **Vice President**: Sumit Ghosh
- **Founder & PI**: Prof. Deepak Kumar Tiwari

### Achievements
- First RVSCET team to reach SIH 2025 Grand Finale
- Successful organization of national-level HackQubit
- Partnership with Google Developer Groups (GDG) Ranchi
- "One of the Best Community Partner Award" at RanchiHacks 2026
- NPTEL Star Awards secured by members

---

## Design System

### Color Palette
- **Primary**: Black (#000000) and White (#FFFFFF)
- **Accent**: Yellow (#eeff00), Blue (#60a5fa, #1d4ed8)
- **Background**: Dark theme (#050505, #0a0a0a)
- **Text**: Gray scale for hierarchy

### Typography
- **Headings**: Large, bold, tracking-tight
- **Body**: Light font weights for elegance
- **Monospace**: Used for labels and technical elements

### Layout Principles
- **Responsive**: Mobile-first approach
- **Whitespace**: Generous spacing for visual impact
- **Grid**: CSS Grid for complex layouts
- **Flexbox**: For component-level layouts

---

## SEO & Metadata

### HTML Meta Tags
- **Title**: Helix - Tech & AI Club of RVSCET
- **Description**: Welcome to Helix, the vibrant Tech and AI club at RVSCET
- **Keywords**: Helix, RVSCET, Tech Club, AI Club, Web Development, Cybersecurity
- **Open Graph**: Facebook/social sharing optimization
- **Twitter Card**: Twitter sharing optimization
- **Structured Data**: JSON-LD for organization schema

### Performance
- **Favicon**: Custom SVG favicon
- **Robots.txt**: Search engine directives
- **Sitemap.xml**: Site structure for crawlers

---

## Development Workflow

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Build Configuration
- **Vite Config**: TailwindCSS integration, React plugin, Babel with React Compiler
- **React Compiler**: Enabled for automatic performance optimizations
- **ESLint**: Configured for React with hooks and refresh plugins

---

## Performance Optimizations

1. **Code Splitting**: Lazy loading of route components
2. **Image Optimization**: Lazy loading, proper formats
3. **Animation Performance**: GPU acceleration, proper cleanup
4. **Bundle Size**: Tree shaking, minimal dependencies
5. **Rendering**: React Compiler for automatic memoization
6. **Scroll Performance**: Lenis for smooth scrolling, requestAnimationFrame-based updates

---

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Features**: CSS Grid, Flexbox, ES6+, WebGL (for Three.js)
- **Fallbacks**: Graceful degradation for older browsers

---

## Deployment

- **Platform**: Vercel
- **Build Process**: Vite production build
- **Environment**: Production-optimized configuration

---

## Future Enhancements

Potential areas for expansion:
1. Additional event galleries and archives
2. Member registration system
3. Blog/news section
4. Interactive project showcase
5. Enhanced 3D experiences
6. Multi-language support
7. Admin dashboard for content management

---

## Technical Notes

### Cursor Context
- Global state management for cursor variants
- Used across components for interactive feedback

### String Pluck Effect
- Guitar string-like animation effect
- Audio integration with sound files

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (<768px), desktop (≥768px)
- Touch-friendly interactions

---

## Conclusion

The Helix website represents a modern, performance-optimized web application showcasing the technical excellence of the Helix Tech & AI Club at RVSCET. Built with cutting-edge technologies and best practices, it provides an immersive experience while maintaining high performance standards. The site serves as both a promotional tool and a testament to the club's technical capabilities in web development, UI/UX design, and interactive experiences.
