---
name: DevCompass Intelligence
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#464555'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
  surface-bg: '#FFFFFF'
  surface-muted: '#F9FAFB'
  surface-subtle: '#F3F4F6'
  success: '#10B981'
  border-base: '#E5E7EB'
  ai-glow: rgba(139, 92, 246, 0.1)
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for the "AI Operating System for Developers." It embodies a **Minimalist-Corporate** aesthetic with a high-performance, developer-centric feel. Inspired by the utility of GitHub and the refinement of Vercel, the system prioritizes clarity, speed, and intellectual rigor.

The visual narrative is built on high-contrast surfaces, razor-sharp typography, and subtle technical accents. It avoids unnecessary decoration, using whitespace as a functional tool to separate complex data streams. The goal is to evoke a sense of **calm authority**—positioning the platform as a sophisticated guide that transforms raw code data into meaningful career intelligence.

Key stylistic markers include:
- **Functional Transparency:** Limited use of glassmorphism to denote "AI layers" or floating insights.
- **Monochromatic Foundation:** A strict neutral base that allows AI-driven highlights to command attention.
- **Precision Engineering:** Subtle 1px borders and disciplined alignment that mirrors the structure of high-quality code.

## Colors

The color strategy uses a **layered neutral approach** to build interface depth. The primary background is pure white to ensure maximum readability and a clean "canvas" feel.

- **Primary (Indigo):** Used for core actions and navigation. It represents the professional "Compass."
- **Secondary (Purple):** Reserved exclusively for AI-generated insights, Agent status, and "Developer DNA" features. 
- **Tertiary (Orange):** Applied to recommendations, learning gaps, and proactive career nudges.
- **Success (Emerald):** Denotes milestone achievements, skill proficiency increases, and positive career trajectory markers.

The neutral palette transitions from `#FFFFFF` for the page base to `#F9FAFB` and `#F3F4F6` for structural grouping (sidebars, card backgrounds). This creates a "tiered" surface hierarchy without relying on heavy shadows.

## Typography

The system utilizes **Inter** for all primary UI and editorial content. Its tall x-height and neutral character provide the clarity required for dense data dashboards. 

A secondary font, **JetBrains Mono**, is introduced for "Technical Labels" and "Developer DNA" attributes. This monospaced font signals to the user that the information is derived directly from their code or system analysis.

Scale rules:
- Use `headline-xl` for landing page heros and major dashboard section headers.
- All technical metadata (commit hashes, file paths, skill scores) must use the `label` stack.
- Tighten letter-spacing on larger headings to maintain a modern, "compact" editorial feel.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for desktop and a **single-column vertical stack** for mobile. The layout philosophy is "Information First," meaning padding is generous to prevent cognitive overload during complex career analysis.

- **Desktop:** 12 columns, 24px gutters, 32px side margins. 
- **Sidebar:** Fixed width of 260px for navigation, allowing the main dashboard area to flex.
- **Sectioning:** Content is grouped into "Logical Blocks" using 32px vertical spacing (`stack-lg`) to differentiate between major analysis areas (e.g., separating "Activity Analyzer" from "Skill Score").
- **Alignment:** All elements must align to a 4px baseline grid to maintain the "precision" brand promise.

## Elevation & Depth

Depth is primarily conveyed through **Tonal Layering** and **Ghost Outlines** rather than heavy shadows.

1.  **Level 0 (Base):** `#FFFFFF` - The main canvas.
2.  **Level 1 (Sub-surface):** `#F9FAFB` - Used for sidebar navigation and secondary containers. 
3.  **Level 2 (Active Cards):** 1px solid `#E5E7EB` border. If an element is "AI-driven," it gains a subtle 8px blur shadow tinted with the secondary purple (`rgba(139, 92, 246, 0.05)`).
4.  **Level 3 (Modals/Overlays):** A white surface with a slightly more pronounced, diffused shadow (`0 20px 25px -5px rgba(0,0,0,0.1)`) and a subtle glassmorphic backdrop blur (8px) on the overlay.

Interactive elements should feel "lifted" only upon hover, using a 2px vertical offset and a slight sharpening of the border color.

## Shapes

The shape language is **Refined-Rounded**. Following the `Rounded (2)` specification, standard UI elements (buttons, inputs, small cards) use a `0.5rem (8px)` radius.

Large dashboard modules and "AI Portfolio" cards use `rounded-lg (1rem)` to feel more like distinct, contained objects. This softness contrasts against the sharp typography and grid lines, making the "AI Coach" feel approachable rather than clinical.

## Components

### Buttons
- **Primary:** Solid `#4F46E5`, white text, 8px radius.
- **AI-Action:** Gradient border (Indigo to Purple) with a soft `ai-glow` on hover. Used for "Generate Portfolio" or "Analyze DNA."
- **Ghost:** Transparent background, `#111827` text, appears on `#E5E7EB` border only on hover.

### Cards
- **Standard:** White background, 1px `#E5E7EB` border, 16px corner radius.
- **Insight Card:** Features a 4px left-border accent in the `Secondary` (Purple) color to denote AI participation.

### Interactive Charts (Recharts Integration)
- Use a monochromatic palette for general stats.
- Use the `Success` (Emerald) color for growth trends.
- Tooltips should use a dark background (`#111827`) with white text to pop against the light interface.

### Input Fields
- Subtle `#F3F4F6` fill with no border in default state.
- Transition to white background with a 1px Indigo border on focus.

### Chips/Tags
- **DNA Tags:** Use the Monospace label font, small caps, with a light purple background and dark purple text.
- **Skill Tags:** High-contrast neutral (Black background, White text) to look like GitHub tags.