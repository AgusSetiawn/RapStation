# RapsStation - Gaming Rental Platform

A modern, responsive web application for a gaming rental service built with React, TypeScript, Vite, and TailwindCSS v4.

## Features

- 🎮 **Multiple Gaming Options**: PlayStation 4, PlayStation 5, and PC Gaming (Warnet)
- 🌓 **Dark/Light Mode**: Theme toggle with localStorage persistence
- 📱 **Fully Responsive**: Mobile-first design with elegant desktop layouts
- ✨ **Modern Animations**: Smooth transitions, 3D card effects, and scroll reveals
- 📋 **Form Validation**: Complete booking form with validation and user feedback
- ♿ **Accessible**: ARIA labels and keyboard navigation support
- 🎨 **Clean Code**: TypeScript types, custom hooks, and centralized constants

## Project Structure

```
src/
├── components/         # React components
│   ├── About.tsx      # Company information section
│   ├── BookingForm.tsx # Booking form with validation
│   ├── Facilities.tsx  # Gaming facilities showcase
│   ├── Header.tsx     # Navigation header
│   └── Slideshow.tsx  # Image carousel
├── hooks/             # Custom React hooks
│   ├── useTheme.ts    # Theme management hook
│   └── useScrollDetect.ts # Scroll detection hook
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── validation.ts  # Form validation logic
├── constants.ts       # App-wide constants
├── App.tsx           # Main app component
├── main.tsx          # App entry point
└── index.css         # Global styles & animations
```

## Prerequisites

Before running this project, you need to have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**

### Installing Node.js

If you don't have Node.js installed:

1. Download from [nodejs.org](https://nodejs.org/)
2. Install the LTS (Long Term Support) version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or another port if 5173 is busy)

3. **Build for Production**
   ```bash
   npm run build
   ```
   Production files will be in the `dist/` directory

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

5. **Run Linter**
   ```bash
   npm run lint
   ```

## Code Quality Improvements Made

### ✅ Fixed Issues
- ❌ Removed unprofessional content from About component
- ✅ Fixed navigation menu inconsistency between mobile/desktop
- ✅ Added comprehensive form validation with user feedback
- ✅ Implemented form submission handling
- ✅ Fixed hardcoded image paths for production builds
- ✅ Added proper TypeScript interfaces

### 🎯 Code Organization
- Created custom hooks for theme and scroll detection
- Centralized constants for magic numbers and configuration
- Added TypeScript types for all data structures
- Implemented validation utilities
- Improved accessibility with ARIA labels

### 🎨 Component Improvements
- **Header**: Uses custom hooks, proper ARIA labels
- **BookingForm**: Full validation, error states, success feedback
- **Slideshow**: Proper asset imports, accessibility attributes
- **Facilities**: TypeScript types, constants for 3D effects
- **About**: Professional content with company info and contact details

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (using rolldown-vite variant)
- **TailwindCSS v4** - Styling
- **Lucide React** - Icons
- **crypto-js** - Encryption utilities (currently unused, consider removing)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This project follows best practices for React and TypeScript development. When contributing:

1. Use TypeScript for type safety
2. Follow the existing code structure
3. Use the custom hooks and constants provided
4. Add proper ARIA labels for accessibility
5. Test in both light and dark modes
6. Ensure responsive design works on all screen sizes

## License

All rights reserved © 2025 RapsStation

---

**Note**: If you encounter any "Cannot find module" errors, make sure you've run `npm install` to install all dependencies first.
