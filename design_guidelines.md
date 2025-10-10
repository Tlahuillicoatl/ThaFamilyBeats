# ThaFamilyBeats Studio - Design Guidelines

## Design Approach
**Reference-Based with Industry Inspiration**
Drawing from premium music industry platforms (Splice, Tracklib, SoundBetter) combined with sleek booking systems (Calendly, Fresha) to create a professional yet creative studio experience that reflects the bold TFB brand.

## Core Design Principles
1. **Bold Professional**: High-contrast, chrome-inspired aesthetic matching the TFB logo
2. **Studio Prestige**: Premium feel that conveys top-tier production quality
3. **Effortless Booking**: Clear, intuitive paths to studio sessions and mixing services
4. **Trust & Credibility**: Professional presentation that builds confidence in services

---

## Color Palette

### Dark Mode (Primary)
- **Background**: 0 0% 8% (deep charcoal, matching studio vibe)
- **Surface**: 0 0% 12% (elevated elements, cards)
- **Chrome Accent**: 0 0% 85% (metallic silver for highlights)
- **Primary Brand**: 0 0% 98% (crisp white for contrast)
- **Muted Text**: 0 0% 60% (secondary information)

### Light Mode
- **Background**: 0 0% 98%
- **Surface**: 0 0% 100%
- **Chrome Accent**: 0 0% 20%
- **Primary Brand**: 0 0% 5%
- **Muted Text**: 0 0% 45%

### Accent Colors (Minimal Use)
- **Success/Active**: 142 76% 36% (studio green for booking confirmations)
- **Alert**: 0 84% 60% (recording red for CTAs on select pages)

---

## Typography

### Font Families
- **Primary (Headings)**: 'Orbitron' or 'Rajdhani' - Bold, tech-forward, matches chrome aesthetic
- **Secondary (Body)**: 'Inter' or 'DM Sans' - Clean, highly readable for information
- **Accent (Prices/Stats)**: 'JetBrains Mono' - Monospace for technical precision

### Type Scale
- **Hero**: text-6xl to text-8xl, font-bold (96-128px)
- **Section Headers**: text-4xl to text-5xl, font-bold (48-64px)
- **Card Titles**: text-xl to text-2xl, font-semibold (24-32px)
- **Body**: text-base to text-lg (16-18px)
- **Small/Meta**: text-sm (14px)

---

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 4, 6, 8, 12, 16, 20, 24, 32**
- Micro spacing: p-2, gap-4
- Component spacing: p-6, p-8
- Section spacing: py-16, py-20, py-24, py-32
- Container max-width: max-w-7xl

### Grid Patterns
- **Home/About**: Asymmetric layouts, 60/40 splits
- **Services**: 2-3 column grids (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- **Booking/Contact**: 2-column split (form + visual/info)

---

## Component Library

### Navigation
- Fixed header with glass-morphism effect (backdrop-blur-xl)
- Logo left, nav center/right
- Mobile: Slide-in menu with overlay
- Chrome underline on active page

### Hero Sections
**Home Page**: Full-viewport hero with TFB logo large-scale integration
- Background: Dark with subtle gradient or studio image overlay
- CTA buttons: Primary (solid white) + Secondary (outline with blur backdrop)
- Floating chrome elements as decorative accents

### Cards & Surfaces
- Rounded corners: rounded-xl (12px)
- Subtle borders: border border-white/10
- Hover states: Lift effect with shadow and chrome accent glow
- Glass-morphism for overlays: bg-black/40 backdrop-blur-lg

### Buttons
- **Primary CTA**: Solid white with black text, bold weight
- **Secondary**: Outline white, blur backdrop when on images
- **Accent**: Chrome gradient for special actions
- Padding: px-8 py-3 to px-10 py-4
- No custom hover states (use defaults)

### Forms & Inputs
- Dark backgrounds with subtle borders
- Focus: Chrome accent ring
- Labels: Small, uppercase, spaced lettering
- Inputs: Generous padding (p-4)

### Modal/Pop-up (Checkout)
- Center-screen overlay with backdrop blur
- Glass-morphism card design
- Clean form layout with payment method icons
- Close button: Top-right, chrome accent

### Service Cards
- Image/icon at top
- Title + description
- Pricing (monospace font)
- "Book Now" or "Learn More" CTA
- Hover: Lift + chrome glow border

---

## Page-Specific Layouts

### Home
- Hero: Full viewport with logo, tagline, dual CTAs
- Services preview: 3-column grid
- Studio showcase: Large image + stats overlay
- Testimonials: Horizontal scroll or 2-column
- CTA section: Bold, centered

### Studio Booking
- Calendar/time picker: Left column
- Session details: Right column
- Package cards above calendar
- Checkout modal on selection

### ThaFamilyMixes
- Service tiers: 3 cards (Basic, Pro, Premium)
- Before/after audio players
- Process timeline visualization
- Pricing table with feature comparison

### Sync Licensing
- Beat catalog: Grid with audio preview
- Filter/search sidebar
- Licensing terms accordion
- Cart system with modal checkout

### About Us
- Studio story: Text + image split
- Team section: Grid of profiles
- Equipment showcase: Image gallery
- Awards/credentials: Icon + text grid

### Contact
- Form: Left column (name, email, message, service type)
- Info: Right column (address, hours, socials)
- Map integration suggestion

---

## Images

### Required Images
1. **Home Hero**: Studio environment - recording booth, equipment, atmospheric lighting (full-width, 70vh)
2. **Studio Booking**: Recording session in progress (featured card background)
3. **ThaFamilyMixes**: Mixing console close-up (header background)
4. **About Us**: Team photo in studio (featured section)
5. **Service Cards**: Icons or abstract visuals for each service type

### Image Treatment
- Overlay: Dark gradient (from transparent to 40% black)
- Filters: Slight desaturation, increased contrast for chrome aesthetic
- Aspect ratios: 16:9 for heroes, 1:1 for cards, 4:3 for features

---

## Animations & Interactions
- Page transitions: Minimal, fast fades
- Card hovers: Subtle lift (translateY -4px) + shadow
- Chrome accents: Gentle pulse on CTAs
- Scroll reveals: Fade-up for sections (use sparingly)
- NO distracting animations, keep professional

---

## Accessibility
- Maintain WCAG AA contrast ratios (4.5:1 minimum)
- Dark mode optimized for all form inputs
- Clear focus states on all interactive elements
- Semantic HTML throughout

---

**Design Philosophy**: Create a premium, studio-grade experience that's as polished as the music produced within. Bold, professional, and conversion-focused with chrome-inspired visual language that reinforces the ThaFamilyBeats brand identity.