# HK Bus ETA - Styling Design System

## Overview

This document outlines the premium design system for the HK Bus ETA application, built with Tailwind CSS v4 and shadcn/ui components.

## Color Palette

### Primary Colors

- **Light Mode**: Indigo-600 (`hsl(237, 85%, 55%)`)
- **Dark Mode**: Indigo-500 (`hsl(237, 85%, 65%)`)
- Used for: Primary buttons, active states, key interactive elements, brand identity

### Background Colors

- **Light Mode**: Slate-50 (`hsl(0, 0%, 98%)`)
- **Dark Mode**: Zinc-950 (`hsl(240, 6%, 10%)`)
- Used for: Page backgrounds, main content areas

### Surface Colors

- **Light Mode**: White (`hsl(0, 0%, 100%)`)
- **Dark Mode**: Zinc-900 (`hsl(240, 6%, 11%)`)
- Used for: Cards, panels, modals, dropdowns

### Border Colors

- **Light Mode**: Slate-200 (`hsl(240, 5.9%, 90%)`)
- **Dark Mode**: Zinc-800 (`hsl(240, 3.7%, 15.9%)`)
- Used for: Component borders, dividers, outlines

### Text Colors

- **Light Mode Primary**: Slate-900 (`hsl(222, 47%, 11%)`)
- **Dark Mode Primary**: Slate-50 (`hsl(210, 40%, 98%)`)
- **Light Mode Secondary/Muted**: Slate-400-600
- **Dark Mode Secondary/Muted**: Slate-300-400

### Accent Colors

#### Success (Accent)

- **Color**: Emerald-500 (`hsl(147, 56%, 44%)`)
- Used for: Success messages, positive indicators, active route statuses

#### Warning

- **Color**: Amber-500 (`hsl(35, 92%, 50%)`)
- Used for: Warning messages, attention needed, delayed routes

#### Error (Destructive)

- **Light Mode**: Rose-500 (`hsl(0, 84.2%, 60.2%)`)
- **Dark Mode**: Rose-900 (`hsl(0, 62.8%, 30.6%)`)
- Used for: Error messages, failed states, critical issues

### Neutral Colors

#### Secondary

- **Light Mode**: Slate-100 (`hsl(240, 4.8%, 95.9%)`)
- **Dark Mode**: Slate-800 (`hsl(240, 3.7%, 15.9%)`)
- Used for: Secondary backgrounds, inactive states

#### Muted

- **Light Mode**: Slate-100 (`hsl(240, 4.8%, 95.9%)`)
- **Dark Mode**: Slate-800 (`hsl(240, 3.7%, 15.9%)`)
- **Light Mode Text**: Slate-500 (`hsl(240, 3.8%, 46.1%)`)
- **Dark Mode Text**: Slate-400 (`hsl(240, 5%, 64.9%)`)
- Used for: Disabled text, subtle information, metadata

## Typography

### Font Family

- **Primary**: "Chiron Hei HK WS" (custom font for Chinese character support)
- **Fallback**: system-ui, sans-serif
- **Weight**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Font Size Scale

| Size | Pixels    | Use Case                         |
| ---- | --------- | -------------------------------- |
| 12px | text-xs   | Captions, labels, metadata       |
| 14px | text-sm   | Secondary text, descriptions     |
| 16px | text-base | Body text, default size          |
| 18px | text-lg   | Section headings, important text |
| 20px | text-xl   | Card titles, page headings       |

### Font Weights

- **Regular (400)**: Body text, descriptions
- **Medium (500)**: UI labels, emphasis
- **Semibold (600)**: Headings, important text
- **Bold (700)**: Titles, strong emphasis

### Line Height

- Tight: 1.25 (headings)
- Normal: 1.5 (body text)
- Relaxed: 1.75 (paragraphs)

## Spacing

### Scale (in pixels)

- 4px: gap-1, p-1 (micro spacing)
- 8px: gap-2, p-2 (small spacing)
- 12px: gap-3, p-3 (medium spacing)
- 16px: gap-4, p-4 (default spacing)
- 24px: gap-6, p-6 (large spacing)
- 32px: gap-8, p-8 (extra large spacing)

### Usage Guidelines

- **Components**: Use 8px/12px/16px for internal padding
- **Layout**: Use 16px/24px for margins between sections
- **Grid**: Use 16px/24px for grid gaps

## Border Radius

### Scale

- Small: 4px (`rounded-sm`) - Small elements, badges
- Medium: 6px (`rounded`) - Default radius for most components
- Large: 8px (`rounded-lg`) - Cards, buttons
- XL: 12px (`rounded-xl`) - Modal dialogs
- Full: 9999px (`rounded-full`) - Pills, circular elements

### Default Radius

- **Global Default**: 8px (0.5rem)
- Applied via `--radius` CSS variable

## Shadows

### Scale

- **sm**: Subtle elevation (0 1px 2px rgba(0,0,0,0.05))
- **default**: Standard elevation (0 1px 3px rgba(0,0,0,0.1))
- **md**: Medium elevation (0 4px 6px -1px rgba(0,0,0,0.1))
- **lg**: High elevation (0 10px 15px -3px rgba(0,0,0,0.1))

### Usage

- **Cards**: `shadow-sm` or `shadow`
- **Modals**: `shadow-lg` or `shadow-xl`
- **Dropdowns**: `shadow-lg`

## Dark Mode

### Implementation

- Uses CSS class-based dark mode (`.dark` class on body/html)
- CSS variables automatically switch between light/dark values
- All colors defined with `hsl()` for smooth transitions

### Guidelines

- Ensure text contrast meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Test all interactive elements in both modes
- Maintain brand consistency across themes

## Component Guidelines

### Buttons

- **Primary**: Indigo-600 (light) / Indigo-500 (dark) background, white text
- **Secondary**: Slate-100 (light) / Slate-800 (dark) background, foreground text
- **Destructive**: Rose-500 background, white text
- **Outline**: Transparent background, border with foreground color
- **Ghost**: Hover state only, transparent background

### Cards

- Background: White (light) / Zinc-900 (dark)
- Border: Slate-200 (light) / Zinc-800 (dark)
- Shadow: `shadow-sm`
- Radius: `rounded-lg` (8px)

### Inputs

- Background: White (light) / Zinc-900 (dark)
- Border: Slate-200 (light) / Zinc-800 (dark)
- Focus ring: Indigo ring with 2px offset
- Radius: `rounded-md` (6px)

### Badges

- **Success**: Emerald-500 background, white text
- **Warning**: Amber-500 background, white text
- **Error**: Rose-500 background, white text
- **Info**: Indigo-500 background, white text
- **Neutral**: Slate-100 (light) / Slate-800 (dark) background, foreground text

## Accessibility

### Color Contrast

- All text colors meet WCAG AA standards
- Success indicators use both color and icons
- Error states use both color and icons
- Focus states are clearly visible with ring offset

### Focus Management

- Focus ring: 2px offset, Indigo-500 color
- Focus visible on all interactive elements
- Skip links for keyboard navigation

### Screen Readers

- Proper aria labels on all interactive elements
- Color-independent state indicators
- Semantic HTML structure

## Animation

### Duration

- Fast: 150ms (micro-interactions)
- Normal: 200ms (default transitions)
- Slow: 300ms (complex animations)

### Easing

- **ease-out**: Entering animations
- **ease-in**: Exiting animations
- **ease-in-out**: Complex animations

### Predefined Animations

- `accordion-down`: 200ms ease-out
- `accordion-up`: 200ms ease-out

## Responsive Design

### Breakpoints

- **sm**: 640px (mobile landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (wide desktop)
- **2xl**: 1400px (ultra wide)

### Container

- Centered with 2rem padding
- Max-width: 1400px for 2xl screens

## Custom Properties (CSS Variables)

All design tokens are defined as CSS variables for easy theming:

```css
--background: hsl(...) --foreground: hsl(...) --primary: hsl(...) --primary-foreground:
  hsl(...) --secondary: hsl(...) --secondary-foreground: hsl(...) --muted: hsl(
    ...
  ) --muted-foreground: hsl(...) --accent: hsl(...) --accent-foreground: hsl(
    ...
  )
  --destructive: hsl(...) --destructive-foreground: hsl(...) --border: hsl(...) --input:
  hsl(...) --ring: hsl(...) --radius: 0.5rem;
```

## Utility Functions

### cn() Function

Location: `src/lib/utils.ts`

Merges Tailwind classes intelligently, handling conflicts and conditional classes:

```typescript
import { cn } from "@/lib/utils";

// Usage
cn("px-4 py-2", isActive && "bg-indigo-600", "text-white");
```

## Component Library

The app uses [shadcn/ui](https://ui.shadcn.com/) as the component foundation:

- Location: `src/components/ui/`
- Style: New York
- Base color: Zinc
- CSS Variables: Enabled

## Migration Notes

### Status: Phase 0 Complete ✓

- Tailwind CSS v4 installed and configured
- Utility functions created
- Design system documented
- Ready for component migration (Phase 1+)

### Material-UI Packages Removed

- @mui/material
- @emotion/react
- @emotion/styled
- @emotion/cache
- @mui/styles
- @mui/icons-material
- @mui/x-date-pickers

### New Dependencies Added

- tailwindcss@next (v4.0.0)
- postcss
- autoprefixer
- @tailwindcss/vite
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react (icons)

## Changelog

### 2026-01-27 - Phase 0 Complete

- Installed Tailwind CSS v4
- Created tailwind.config.js with premium color scheme
- Set up shadcn/ui configuration
- Created utility functions (cn)
- Documented design system in STYLING.md
- Configured CSS variables for light/dark mode
- Updated index.css with Tailwind directives and theme variables
