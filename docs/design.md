# UI Architecture & Design System Specification

> **Version**: 2.0.0  
> **Status**: Approved Specification  
> **Theme**: Minimalist, High Contrast, Responsive, Dual-Theme (Light / Dark)

---

## Executive Summary

This document outlines the technical architecture, component hierarchy, design tokens, and interaction guidelines for the web application platform. The system emphasizes extreme performance, a minimalist functional aesthetic, low optical fatigue, and direct usability across mobile, tablet, and desktop viewports.

---

## 1. Design System & Tokens

### Design Philosophy
* **Minimalist & Content-First**: Reduced visual noise, strict spatial grid, no unneeded iconography or decorative background animations.
* **Functional Interactivity**: Purposeful micro-interactions with smooth transition timing and clean hover states.
* **Accessible Contrast**: Fully WCAG AA compliant across both Light and Dark themes.

---

### Color System & Palette

#### Light Mode Palette
| Token Name | Hex Code | Tailwind Equivalent | Use Case |
| :--- | :--- | :--- | :--- |
| `color-primary` | `#2563EB` | `blue-600` | Primary buttons, active state highlights |
| `color-primary-hover` | `#1D4ED8` | `blue-700` | Button hover states |
| `color-secondary` | `#4F46E5` | `indigo-600` | Secondary indicators, visual accents |
| `color-neutral-dark` | `#0F172A` | `slate-900` | Primary headings, body text |
| `color-neutral-muted` | `#475569` | `slate-600` | Secondary text, captions, subtitles |
| `color-background` | `#FFFFFF` | `white` | Page base background |
| `color-surface` | `#F8FAFC` | `slate-50` | Card panels, sidebar background |
| `color-border` | `#E2E8F0` | `slate-200` | Container borders, table dividers |
| `color-success` | `#16A34A` | `green-600` | Success badges, confirmation toasts |
| `color-warning` | `#D97706` | `amber-600` | Warning badges, caution alerts |
| `color-error` | `#DC2626` | `red-600` | Form error text, destructive actions |

#### Dark Mode Palette
| Token Name | Hex Code | Tailwind Equivalent | Use Case |
| :--- | :--- | :--- | :--- |
| `color-primary` | `#3B82F6` | `blue-500` | Primary buttons, active state highlights |
| `color-primary-hover` | `#2563EB` | `blue-600` | Button hover states |
| `color-secondary` | `#6366F1` | `indigo-500` | Secondary indicators, visual accents |
| `color-neutral-dark` | `#F8FAFC` | `slate-50` | Primary text in dark mode |
| `color-neutral-muted` | `#94A3B8` | `slate-400` | Secondary text in dark mode |
| `color-background` | `#0F172A` | `slate-900` | Page base background |
| `color-surface` | `#1E293B` | `slate-800` | Card panels, sidebar background |
| `color-border` | `#334155` | `slate-700` | Container borders, table dividers |

---

### Typography Scale

* **Font Family**: `Inter`, system-ui, -apple-system, sans-serif

```css
/* Typography Design Tokens */
--font-h1: 600 2.25rem/2.5rem 'Inter', sans-serif;    /* 36px */
--font-h2: 600 1.5rem/2.0rem 'Inter', sans-serif;     /* 24px */
--font-h3: 500 1.25rem/1.75rem 'Inter', sans-serif;   /* 20px */
--font-body: 400 1.0rem/1.5rem 'Inter', sans-serif;   /* 16px */
--font-caption: 400 0.875rem/1.25rem 'Inter', sans-serif; /* 14px */