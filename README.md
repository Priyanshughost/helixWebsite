<div align=center>
<h1>Helix - Tech & AI Club Website</h1>

> The official website of Helix, the vibrant Tech & AI club at RVS College of Engineering and Technology, Jamshedpur.

![Helix Website](https://img.shields.io/badge/React-19.2.6-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3.0-38B2AC?logo=tailwind-css)
![GSAP](https://img.shields.io/badge/GSAP-3.15.0-8A2BE2?logo=greensock)

</div>

## 🌟 About

Helix is a student-driven Tech & AI club established on January 9th, 2025, at RVSCET. The club cultivates a supportive community where members delve into cutting-edge fields including Web Development, Cybersecurity, Artificial Intelligence, Robotics, and UX Design.

This website serves as the digital showcase for Helix, featuring immersive animations, interactive experiences, and comprehensive information about the club's activities, events, team, and achievements.

## ✨ Features

- **Immersive Animations**: GSAP-powered scroll animations and smooth transitions
- **Custom Cursor System**: Interactive cursor with morphing effects and hover states
- **3D Event Display**: Cylinder-based 3D arrangement of event cards with flip effects
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Smooth Scrolling**: Lenis integration for buttery smooth scroll experience
- **Performance Optimized**: React Compiler, lazy loading, and GPU-accelerated animations
- **SEO Ready**: Comprehensive meta tags, Open Graph, and structured data
- **Interactive Components**: Magnetic cards, parallax effects, and text reveal animations

## 🚀 Tech Stack

### Core
- **React 19.2.6** - UI library with React Compiler enabled
- **Vite 8.0.12** - Lightning-fast build tool and dev server
- **React Router DOM 7.15.1** - Client-side routing

### Styling
- **TailwindCSS 4.3.0** - Utility-first CSS framework

### Animation & Interactions
- **GSAP 3.15.0** - Professional animation library
- **@gsap/react 2.1.2** - React integration for GSAP
- **Lenis 1.3.23** - Smooth scrolling library

### 3D Graphics
- **Three.js 0.184.0** - 3D graphics library
- **@react-three/fiber 9.6.1** - React renderer for Three.js
- **@react-three/drei 10.7.7** - Useful helpers for react-three-fiber

### Utilities
- **html-to-image 1.11.13** - Image generation from DOM elements

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd helixWebsite

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Project Structure

```
helixWebsite/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── CursorDot.jsx      # Custom cursor with morphing effects
│   │   ├── Loader.jsx         # Initial loading animation
│   │   ├── StringPluck.jsx    # String animation effect
│   │   └── navbar/            # Navigation components
│   ├── sections/        # Page sections
│   │   ├── Hero.jsx           # Landing hero section
│   │   ├── About.jsx          # About section with vision/mission
│   │   ├── Events/            # Events display
│   │   ├── TeamsV2.jsx        # Team member showcase
│   │   ├── HallOfFame.jsx     # Achievements display
│   │   └── [other sections]
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
│   ├── context/         # React context providers
│   ├── styles/          # CSS files
│   └── assets/          # Static assets
├── public/              # Public assets
└── [config files]
```

## 🎨 Key Components

### Custom Cursor System
- Morphing shape effects based on hover state
- Smooth movement with GSAP ticker optimization
- Dynamic scaling based on mouse velocity
- Context-based variant management

### Navigation
- Scroll-based hide/show animation
- Smooth reveal animations on load
- Responsive design with hover effects

### Hero Section
- GSAP SplitText for character-by-character animation
- Wave animation with color transitions
- Scroll-triggered reveals with proper cleanup

### Events Display
- 3D cylinder arrangement of event cards
- Scroll-based rotation and translation
- Card flip effects on hover
- Mouse-based camera tilt parallax

### Team Showcase
- Text split animations with hover effects
- Image parallax effects
- Clip-path reveals
- Social media integration

## 🏆 Club Achievements

- **First RVSCET SIH Finalists**: Team reached Smart India Hackathon 2025 Grand Finale
- **HackQubit Success**: Successfully organized national-level 24-hour hackathon
- **GDG Partnership**: Strategic collaboration with Google Developer Groups Ranchi
- **Community Award**: "One of the Best Community Partner Award" at RanchiHacks 2026
- **NPTEL Excellence**: Multiple members secured prestigious NPTEL Star Awards

## 📅 Key Events (2025-2026)

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

## 👥 Leadership Team

- **President**: Aadarsh Shaheb Singh
- **Vice President**: Prayog Priyanshu
- **Founder & PI**: Prof. Deepak Kumar Tiwari

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Lazy loading with proper formats
- **Animation Performance**: GPU acceleration with proper cleanup
- **Bundle Size**: Tree shaking and minimal dependencies
- **React Compiler**: Automatic memoization for performance
- **Scroll Performance**: Lenis smooth scrolling with requestAnimationFrame

## 🌐 Deployment

The website is deployed on Vercel with production-optimized configuration.

## 📄 License

This project is proprietary and belongs to Helix - Tech & AI Club, RVSCET.

## 🤝 Contributing

This is an internal project for Helix club members. For contributions, please contact the club leadership team.

## 📧 Contact

- **Email**: [club-email@rvscet.ac.in]
- **Location**: RVS College of Engineering and Technology, Jamshedpur
- **Website**: [helix-website-gray.vercel.app](https://helix-website-gray.vercel.app/)

---

**Built with ❤️ by the Helix Tech & AI Club Team**
