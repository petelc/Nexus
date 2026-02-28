# Nexus Brand Guidelines

**Version:** 2.0
**Date:** February 13, 2026
**Status:** Official
**Previous Version:** 1.0 (Purple theme - deprecated)

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Logo Usage](#2-logo-usage)
3. [Color Palette](#3-color-palette)
4. [Typography](#4-typography)
5. [Iconography](#5-iconography)
6. [Voice & Tone](#6-voice--tone)
7. [Application Examples](#7-application-examples)
8. [File Structure](#8-file-structure)

---

## 1. Brand Identity

### 1.1 Brand Name

**Nexus**

### 1.2 Tagline

**"Where Knowledge Connects"**

### 1.3 Brand Essence

Nexus represents the central connection point for IT knowledge. The brand embodies:

- **Connection**: Linking people, ideas, and information
- **Clarity**: Clean, organized, accessible knowledge
- **Innovation**: Modern approach to knowledge management
- **Collaboration**: Bringing teams together
- **Reliability**: Trusted source of technical documentation

### 1.4 Target Audience

- IT Professionals
- Software Developers
- DevOps Engineers
- System Architects
- Technical Writers
- Engineering Teams

### 1.5 Brand Personality

**Professional yet Approachable**
- Expert guidance without jargon overload
- Direct communication, no fluff
- Empowering users to succeed

**Modern & Innovative**
- Forward-thinking technology
- Clean, contemporary aesthetic
- Embraces modern design standards

**Collaborative & Supportive**
- Emphasizes teamwork
- Shared knowledge culture
- Community-focused

---

## 2. Logo Usage

### 2.1 Logo Variations

#### Primary Logo

**Use Cases:**
- Website headers
- Marketing materials
- Presentations
- Official documents

**File Names:**
- `nexus-logo-primary.svg`
- `nexus-logo-primary.png`

**Minimum Size:** 150px width

#### Icon Only

**Use Cases:**
- App icons (mobile, desktop)
- Favicons
- Social media profile pictures
- Small UI elements

**File Names:**
- `nexus-icon.svg`
- `nexus-icon.png`
- `nexus-icon-16x16.png`
- `nexus-icon-32x32.png`
- `nexus-icon-64x64.png`
- `nexus-icon-512x512.png`

**Minimum Size:** 16px

#### Monogram

**Use Cases:**
- Alternative app icon
- Watermarks
- Loading screens
- Branded merchandise

**File Names:**
- `nexus-monogram.svg`
- `nexus-monogram.png`

**Minimum Size:** 32px

#### White/Light Version

**Use Cases:**
- Dark backgrounds
- Dark mode UI
- Video overlays
- Photography

**File Names:**
- `nexus-logo-white.svg`
- `nexus-logo-white.png`

### 2.2 Clear Space

Maintain clear space around the logo equal to the height of the center node in the icon.

```
┌─────────────────────────────────┐
│                                 │
│     ┌───────────────────┐      │
│     │                   │      │
│     │   [NEXUS LOGO]    │      │
│     │                   │      │
│     └───────────────────┘      │
│                                 │
└─────────────────────────────────┘
        ^                ^
        |                |
    Clear Space      Clear Space
```

### 2.3 Incorrect Usage

**DO NOT:**
- ✗ Rotate or skew the logo
- ✗ Change the colors (except approved variations)
- ✗ Add effects (drop shadows, outlines, etc.)
- ✗ Place on busy backgrounds without proper contrast
- ✗ Stretch or distort proportions
- ✗ Separate icon from text in primary logo
- ✗ Use low-resolution or pixelated versions
- ✗ Place in corners without clear space

### 2.4 Background Usage

**Light Backgrounds:**
- Use primary color version (blue gradient)
- Ensure contrast ratio of at least 4.5:1

**Dark Backgrounds:**
- Use white version
- Ensure sufficient contrast

**Photography/Complex Backgrounds:**
- Use monogram with solid background
- Or add subtle backdrop behind logo

---

## 3. Color Palette

### 3.1 Primary Colors

#### Brand Blue (Primary)

```
Hex:  #5D87FF
RGB:  93, 135, 255
HSL:  221°, 100%, 68%
CMYK: 64, 47, 0, 0
```

**Usage:**
- Primary branding
- Interactive elements (buttons, links)
- Icons and accents
- Headings
- Active/selected states

**Accessibility:** Meets WCAG AA standard for large text on white background

#### Blue Variants (Material Design Scale)

```
Blue 50:  #e3f2fd (Lightest - backgrounds, hover states)
Blue 100: #bbdefb
Blue 200: #90caf9
Blue 300: #64b5f6
Blue 400: #42a5f5
Blue 500: #5D87FF (Primary brand color)
Blue 600: #1e88e5 (Hover, pressed states)
Blue 700: #1976d2
Blue 800: #1565c0
Blue 900: #0d47a1 (Darkest - deep accents)
```

### 3.2 Secondary/Accent Colors

#### Cyan

```
Hex:  #49BEFF
RGB:  73, 190, 255
HSL:  201°, 100%, 64%
```

**Usage:** Secondary actions, information states, links

#### Teal

```
Hex:  #13DEB9
RGB:  19, 222, 185
HSL:  169°, 84%, 47%
```

**Usage:** Success states, positive feedback, growth metrics

#### Coral

```
Hex:  #FA896B
RGB:  250, 137, 107
HSL:  13°, 94%, 70%
```

**Usage:** Warnings, errors, important notices

#### Gold

```
Hex:  #FFAE1F
RGB:  255, 174, 31
HSL:  38°, 100%, 56%
```

**Usage:** Alerts, pending states, highlights

### 3.3 Neutral Colors

#### Gray Scale

```
Gray 50:  #f9fafb (Lightest backgrounds)
Gray 100: #f3f4f6 (Surface backgrounds)
Gray 200: #e5e7eb (Borders)
Gray 300: #d1d5db (Disabled states)
Gray 400: #9ca3af (Placeholders)
Gray 500: #6b7280 (Body text - light mode)
Gray 600: #4b5563 (Headings - light mode)
Gray 700: #374151 (Dark text)
Gray 800: #1f2937 (Primary text - light mode)
Gray 900: #111827 (Darkest text)
```

#### Pure Colors

```
White: #ffffff
Black: #000000
```

### 3.4 Dark Mode Palette

#### Backgrounds

```
Primary Background:   #2A3447 (Main app background)
Paper/Surface:        #2A3447 (Cards, panels)
Elevated Surface:     #253662 (Hover states, elevated cards)
Border Color:         #333F55 (Dividers, borders)
```

#### Text Colors (Dark Mode)

```
Primary Text:   #EAEFF4 (Main content)
Secondary Text: #7C8FAC (Supporting text, captions)
Disabled Text:  #4b5563 (Disabled state)
```

### 3.5 Light Mode Palette

#### Backgrounds

```
Primary Background:   #F5F7FA (Main app background)
Paper/Surface:        #FFFFFF (Cards, panels)
Elevated Surface:     #F9FAFB (Hover states)
Border Color:         #E5E7EB (Dividers, borders)
```

#### Text Colors (Light Mode)

```
Primary Text:   #1F2937 (Main content)
Secondary Text: #6B7280 (Supporting text, captions)
Disabled Text:  #9ca3af (Disabled state)
```

### 3.6 Semantic Colors

#### Success

```
Main:  #13DEB9 (Teal)
Light: #5EEAD4
Dark:  #0F766E
```

**Usage:** Successful operations, confirmations, positive metrics

#### Warning

```
Main:  #FFAE1F (Gold)
Light: #FCD34D
Dark:  #D97706
```

**Usage:** Caution messages, pending actions, important notices

#### Error

```
Main:  #FA896B (Coral)
Light: #FCA5A5
Dark:  #DC2626
```

**Usage:** Error messages, destructive actions, critical alerts

#### Info

```
Main:  #49BEFF (Cyan)
Light: #7DD3FC
Dark:  #0284C7
```

**Usage:** Informational messages, tips, neutral notifications

### 3.7 Code Syntax Colors

#### Dark Mode Syntax

```
Background:     #1e1e1e
Comments:       #6a9955 (Green)
Keywords:       #569cd6 (Blue)
Strings:        #ce9178 (Orange)
Numbers:        #b5cea8 (Light green)
Functions:      #dcdcaa (Yellow)
Variables:      #9cdcfe (Light blue)
Operators:      #d4d4d4 (Gray)
```

#### Light Mode Syntax

```
Background:     #ffffff
Comments:       #008000 (Green)
Keywords:       #0000ff (Blue)
Strings:        #a31515 (Red)
Numbers:        #098658 (Teal)
Functions:      #795e26 (Brown)
Variables:      #001080 (Dark blue)
Operators:      #000000 (Black)
```

### 3.8 Color Accessibility

**Contrast Ratios (WCAG AA Compliance):**

| Color Combination | Contrast Ratio | WCAG Level |
|-------------------|----------------|------------|
| Blue 500 on White | 4.57:1 | AA (Large text) |
| Gray 800 on White | 12.63:1 | AAA |
| White on Blue 600 | 5.74:1 | AA |
| Gray 500 on White | 4.56:1 | AA |
| White on Gray 800 | 12.63:1 | AAA |

**Best Practices:**
- Use Gray 800 for body text on white
- Use White or Gray 50 for text on dark backgrounds
- Avoid placing Blue 500 directly on white for small text
- Use Blue 600 or darker for better contrast

---

## 4. Typography

### 4.1 Primary Typeface

**Inter** (Google Fonts)

- Modern, clean, highly readable
- Excellent for UI and body text
- Available in 9 weights (100-900)
- Optimized for screen rendering

**Weights Used:**
```
Regular (400)  - Body text, paragraphs
Medium (500)   - UI elements, captions, labels
SemiBold (600) - Subheadings, emphasized text
Bold (700)     - Headings, titles
```

**Fallback Stack:**

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue',
             Arial, sans-serif;
```

**Font Smoothing:**
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### 4.2 Monospace Typeface

**Fira Code** (Google Fonts)

- Designed specifically for code
- Programming ligatures (optional)
- Clear distinction of characters (0 vs O, 1 vs l)

**Usage:**
- Code blocks
- Code snippets
- Terminal output
- File paths
- Technical identifiers

**Fallback Stack:**

```css
font-family: 'Fira Code', 'Courier New',
             Consolas, Monaco, 'Liberation Mono', monospace;
```

### 4.3 Type Scale

#### Headings

```css
Heading 1:  48px / 3rem      (Weight: 700, Line height: 1.2, Letter spacing: -0.02em)
Heading 2:  36px / 2.25rem   (Weight: 700, Line height: 1.3, Letter spacing: -0.01em)
Heading 3:  30px / 1.875rem  (Weight: 600, Line height: 1.3)
Heading 4:  24px / 1.5rem    (Weight: 600, Line height: 1.4)
Heading 5:  20px / 1.25rem   (Weight: 600, Line height: 1.4)
Heading 6:  18px / 1.125rem  (Weight: 600, Line height: 1.5)
```

#### Body Text

```css
Body Large:  18px / 1.125rem  (Weight: 400, Line height: 1.7)
Body:        16px / 1rem      (Weight: 400, Line height: 1.6)
Body Small:  14px / 0.875rem  (Weight: 400, Line height: 1.5)
Caption:     12px / 0.75rem   (Weight: 500, Line height: 1.4)
Overline:    11px / 0.6875rem (Weight: 500, Line height: 1.3, Letter spacing: 0.08em, Uppercase)
```

#### UI Elements

```css
Button Large:  16px / 1rem      (Weight: 500)
Button:        14px / 0.875rem  (Weight: 500)
Button Small:  13px / 0.8125rem (Weight: 500)
Label:         14px / 0.875rem  (Weight: 500)
Helper Text:   12px / 0.75rem   (Weight: 400)
```

### 4.4 Text Styling

#### Headings (Light Mode)

```css
color: #111827 (Gray 900)
letter-spacing: -0.02em (H1, H2 only)
margin-bottom: 0.5em
```

#### Headings (Dark Mode)

```css
color: #EAEFF4 (Light)
letter-spacing: -0.02em (H1, H2 only)
margin-bottom: 0.5em
```

#### Body Text (Light Mode)

```css
color: #4b5563 (Gray 600)
letter-spacing: 0
line-height: 1.6
```

#### Body Text (Dark Mode)

```css
color: #EAEFF4 (Light)
letter-spacing: 0
line-height: 1.6
```

#### Links

```css
color: #5D87FF (Primary Blue)
text-decoration: underline
cursor: pointer

/* Hover */
color: #1e88e5 (Blue 600)
text-decoration: underline
```

#### Inline Code

```css
background: #f3f4f6 (Light mode) / #253662 (Dark mode)
color: #FA896B (Coral)
padding: 2px 6px
border-radius: 4px
font-family: 'Fira Code', monospace
font-size: 0.875em
```

---

## 5. Iconography

### 5.1 Icon Style

**Characteristics:**
- Minimalist, geometric design
- 2px stroke weight for outline icons
- Rounded corners (2-3px radius)
- Consistent sizing grid
- Clean, simple shapes

**Recommended Icon Sets:**
- **Heroicons** (Primary choice) - Modern, clean, two styles (outline, solid)
- **Lucide Icons** (Alternative) - Consistent, well-designed
- **Feather Icons** (Alternative) - Minimal, beautiful

### 5.2 Icon Sizes

```
Extra Small:  16px (inline with text, tight spaces)
Small:        20px (list items, compact UI)
Medium:       24px (default UI, buttons, navigation)
Large:        32px (feature highlights, headers)
Extra Large:  48px (empty states, illustrations)
```

### 5.3 Icon Colors

#### Light Mode

```
Default:  #6b7280 (Gray 500)
Active:   #5D87FF (Primary Blue)
Hover:    #1e88e5 (Blue 600)
Disabled: #d1d5db (Gray 300)
```

#### Dark Mode

```
Default:  #7C8FAC (Secondary text)
Active:   #5D87FF (Primary Blue)
Hover:    #90caf9 (Blue 200)
Disabled: #4b5563 (Gray 600)
```

### 5.4 Icon Usage Guidelines

**DO:**
- ✓ Use consistent sizes throughout your design
- ✓ Align icons with adjacent text
- ✓ Maintain proper spacing (8px minimum)
- ✓ Use semantic icons that match their function
- ✓ Provide accessible labels for screen readers

**DON'T:**
- ✗ Mix icon styles (outline and solid)
- ✗ Stretch or distort icons
- ✗ Use decorative icons excessively
- ✗ Place icons without proper context
- ✗ Use low-contrast icon colors

---

## 6. Voice & Tone

### 6.1 Brand Voice

**Nexus is:**

**Professional but Approachable**
- Expert guidance without overwhelming jargon
- Direct communication, no fluff
- Respectful of user's technical knowledge

**Clear and Concise**
- Short, scannable sentences
- Active voice over passive
- Specific rather than vague

**Helpful and Supportive**
- Empowering users to succeed
- Encouraging without being condescending
- Providing context when needed

**Innovative**
- Forward-thinking language
- Embracing modern technology
- Progressive yet practical

**Collaborative**
- Emphasizing teamwork
- Shared knowledge culture
- Community-oriented

### 6.2 Tone Guidelines

#### In Documentation

**Style:**
- Clear, instructional
- Active voice ("Click the button" not "The button should be clicked")
- Short paragraphs (2-3 sentences)
- Bullet points for steps
- Code examples with explanations

**Example:**
```
To create a new document:
1. Navigate to the Documents page
2. Click "New Document"
3. Enter a title and start writing
4. Your changes save automatically every 30 seconds
```

#### In Marketing

**Style:**
- Benefits-focused
- Problem-solving oriented
- Professional yet friendly
- Action-oriented CTAs

**Example:**
```
Stop losing track of your team's knowledge.
Nexus brings your documentation, code snippets, and diagrams
together in one powerful platform.

Start organizing your knowledge today.
```

#### In UI/UX

**Style:**
- Concise labels (1-3 words)
- Clear error messages
- Encouraging success messages
- Actionable button text

**Examples:**
- Buttons: "Save Document", "Create Snippet", "Share Diagram"
- Success: "Document saved successfully"
- Error: "Unable to save. Check your connection and try again."
- Help: "Need help? View the documentation"

#### In Error Messages

**Style:**
- Explain what happened
- Why it happened (if known)
- What the user can do

**Example:**
```
❌ BAD:  "Error 500"
✅ GOOD: "We couldn't save your document. Check your connection and try again."

❌ BAD:  "Invalid input"
✅ GOOD: "Email address must be in the format name@example.com"
```

### 6.3 Writing Style

**DO:**
- ✓ Use "you" to address users directly
- ✓ Write in active voice
- ✓ Use contractions naturally (we're, you'll, it's)
- ✓ Explain technical terms on first use
- ✓ Use parallel structure in lists
- ✓ Include concrete examples

**DON'T:**
- ✗ Use overly technical jargon without explanation
- ✗ Write long, complex sentences
- ✗ Use passive voice excessively
- ✗ Make assumptions about user knowledge
- ✗ Use ALL CAPS for emphasis
- ✗ Include unnecessary exclamation points!!!

### 6.4 Sample Phrases

#### Homepage

```
"Where Knowledge Connects"

Nexus brings your team's documentation, diagrams, and code snippets
together in one powerful platform. Built for developers, by developers.
```

#### Feature Descriptions

```
"Create beautiful technical diagrams with our intuitive visual editor.
No design skills required."

"Syntax highlighting for 150+ programming languages. Your code,
beautifully formatted."

"Real-time collaboration that actually works. See changes as your
teammates type."
```

#### Empty States

```
"No documents yet. Create your first document to get started."

"Your snippet library is empty. Add a snippet to begin building
your collection."
```

#### Success Messages

```
"Document saved successfully!"
"Snippet added to your library"
"Diagram exported to PNG"
"Team member invited"
```

#### Call to Actions

```
"Start Organizing Your Knowledge"
"Try Nexus Free for 14 Days"
"See How It Works"
"Create Your First Document"
"Explore the Documentation"
```

---

## 7. Application Examples

### 7.1 Web Application

#### Header

```
Logo:         Primary logo (200px width)
Background:   White (#FFFFFF) or Dark (#2A3447)
Navigation:   Inter Medium, 16px
Active state: Primary Blue with 2px bottom border
Elevation:    0 (flat) with 1px bottom border
```

#### Sidebar Navigation

```
Width:         270px (fixed)
Background:    Paper color
Item height:   44px
Icon size:     20px
Text:          Inter Medium, 15px
Active state:  Primary Blue background (full width)
Hover state:   Surface color background
Border radius: 8px (nav items)
Padding:       12px 16px (nav items)
```

#### Content Area

```
Background:    Background default
Max width:     1200px (centered)
Padding:       24px (desktop), 16px (mobile)
Grid gap:      24px
Card radius:   7px
Card shadow:   0 1px 3px rgba(0, 0, 0, 0.1)
```

#### Cards

```
Background:     Paper color
Border:         1px solid Divider color
Border radius:  7px
Padding:        20px
Shadow:         0 1px 3px rgba(0, 0, 0, 0.1)
Hover shadow:   0 4px 6px rgba(0, 0, 0, 0.1)
Transition:     all 150ms ease-in-out
```

#### Buttons

```
Primary:
  Background:    #5D87FF
  Text:          White
  Padding:       10px 20px
  Border radius: 7px
  Hover:         #1e88e5

Secondary:
  Background:    Transparent
  Border:        1px solid #5D87FF
  Text:          #5D87FF
  Hover:         Background #e3f2fd

Disabled:
  Background:    #d1d5db
  Text:          #9ca3af
  Cursor:        not-allowed
```

### 7.2 Mobile Application

#### Launch Screen

```
Background:    Primary Blue gradient
Logo:          White version, centered
Size:          64px icon
App name:      Inter Bold, 24px, White
Tagline:       Inter Regular, 14px, White (80% opacity)
```

#### Navigation Bar (iOS)

```
Background:    Paper color with blur
Height:        56px
Title:         Inter SemiBold, 17px
Buttons:       24px icons
Tint color:    Primary Blue
```

#### Tab Bar

```
Background:    Paper color
Height:        49px (iOS), 56px (Android)
Icons:         24px
Labels:        Inter Medium, 11px
Active color:  Primary Blue
Inactive:      Gray 500
Badge:         8px circle, Error color
```

### 7.3 Desktop Application

#### Title Bar (macOS)

```
Height:         38px
Background:     Paper color
Title:          Inter SemiBold, 13px, centered
Traffic lights: Standard macOS position
```

#### Title Bar (Windows)

```
Height:         32px
Background:     Paper color
Title:          Inter SemiBold, 12px
Icon:           16px
Controls:       Standard Windows controls
```

#### Menu Bar

```
Background:     Surface color
Text:           Inter Regular, 13px
Hover:          Surface color (lighter)
Divider:        1px Divider color
```

### 7.4 Email Templates

#### Header

```
Background:    Primary Blue
Logo:          White version, 150px width
Padding:       40px
Text color:    White
```

#### Content

```
Background:    White
Max width:     600px
Font:          Inter or system default
Font size:     16px
Line height:   1.6
Padding:       40px
```

#### Primary CTA Button

```
Background:    #5D87FF
Text:          White, Inter Medium, 16px
Padding:       12px 32px
Border radius: 7px
Display:       inline-block
```

#### Footer

```
Background:    #F5F7FA
Text:          Gray 500, 12px
Links:         Gray 600
Padding:       30px
```

### 7.5 Social Media

#### Profile Picture

```
Format:       Square (1:1)
Size:         Minimum 400x400px
Asset:        Monogram or Icon only
Background:   Primary Blue or White
```

#### Cover Image

```
Dimensions:    Per platform requirements
Asset:         Primary logo on gradient
Include:       Tagline if space allows
Format:        PNG with transparency
```

#### Post Graphics

```
Brand colors:  Primary and accent colors
Logo:          Corner or centered
Typography:    Inter for any text
Consistency:   Maintain brand voice
```

---

## 8. File Structure

```
nexus-brand-assets/
│
├── logos/
│   ├── svg/
│   │   ├── nexus-logo-primary.svg
│   │   ├── nexus-logo-white.svg
│   │   ├── nexus-icon.svg
│   │   ├── nexus-icon-hexagon.svg
│   │   └── nexus-monogram.svg
│   │
│   └── png/
│       ├── nexus-logo-primary@1x.png
│       ├── nexus-logo-primary@2x.png
│       ├── nexus-logo-primary@3x.png
│       ├── nexus-logo-white@1x.png
│       ├── nexus-logo-white@2x.png
│       ├── nexus-icon-16.png
│       ├── nexus-icon-32.png
│       ├── nexus-icon-64.png
│       ├── nexus-icon-128.png
│       ├── nexus-icon-256.png
│       └── nexus-icon-512.png
│
├── colors/
│   ├── color-palette.png
│   ├── color-swatches.ase (Adobe Swatch Exchange)
│   ├── colors.json (JSON color definitions)
│   └── colors.scss (SCSS variables)
│
├── fonts/
│   ├── Inter/
│   │   ├── Inter-Regular.woff2
│   │   ├── Inter-Medium.woff2
│   │   ├── Inter-SemiBold.woff2
│   │   └── Inter-Bold.woff2
│   │
│   └── FiraCode/
│       ├── FiraCode-Regular.woff2
│       └── FiraCode-Medium.woff2
│
├── icons/
│   ├── ui-icons.svg (Icon sprite)
│   ├── custom-icons.svg
│   └── icon-set/ (Individual SVG files)
│
├── templates/
│   ├── presentation-template.pptx
│   ├── document-template.docx
│   ├── email-template.html
│   └── social-media-templates/
│       ├── facebook-cover.psd
│       ├── twitter-header.psd
│       ├── linkedin-banner.psd
│       └── instagram-post.psd
│
├── mockups/
│   ├── web-app-mockup-light.png
│   ├── web-app-mockup-dark.png
│   ├── mobile-app-mockup.png
│   └── desktop-app-mockup.png
│
└── guidelines/
    ├── nexus-brand-guidelines-2026.pdf
    ├── logo-usage-guide.pdf
    ├── color-palette-guide.pdf
    └── quick-reference-card.pdf
```

---

## 9. Design Tokens

### 9.1 Spacing Scale (8px Grid)

```
xs:   4px   (0.25rem)
sm:   8px   (0.5rem)
md:   16px  (1rem)
lg:   24px  (1.5rem)
xl:   32px  (2rem)
2xl:  48px  (3rem)
3xl:  64px  (4rem)
4xl:  96px  (6rem)
```

### 9.2 Border Radius

```
sm:   4px   (Small elements, badges)
md:   7px   (Cards, buttons - PRIMARY)
lg:   12px  (Large cards, modals)
xl:   16px  (Chips, pills)
full: 9999px (Circular elements)
```

### 9.3 Shadows

```
sm:   0 1px 2px rgba(0, 0, 0, 0.05)
md:   0 1px 3px rgba(0, 0, 0, 0.1)
lg:   0 4px 6px rgba(0, 0, 0, 0.1)
xl:   0 10px 15px rgba(0, 0, 0, 0.1)
2xl:  0 20px 25px rgba(0, 0, 0, 0.15)
```

### 9.4 Transitions

```
fast:     150ms ease-in-out
base:     200ms ease-in-out
slow:     300ms ease-in-out
```

### 9.5 Z-Index Scale

```
base:      0
dropdown:  1000
sticky:    1100
fixed:     1200
overlay:   1300
modal:     1400
popover:   1500
tooltip:   1600
```

---

## 10. Accessibility Standards

### 10.1 Color Contrast

**Minimum Requirements (WCAG 2.1):**
- Normal text (< 18px): 4.5:1 contrast ratio (Level AA)
- Large text (≥ 18px): 3:1 contrast ratio (Level AA)
- UI components: 3:1 contrast ratio (Level AA)

**Our Standards:**
- All body text: Minimum 4.5:1
- All headings: Minimum 4.5:1
- All interactive elements: Minimum 4.5:1
- Focus indicators: Minimum 3:1

### 10.2 Focus States

```css
/* Keyboard focus indicator */
outline: 2px solid #5D87FF;
outline-offset: 2px;
border-radius: 4px;
```

### 10.3 Alternative Text

**Required for:**
- All images
- All icons used for actions
- All logo variations
- All diagrams and charts

**Format:**
- Concise and descriptive
- Convey function, not appearance
- Empty alt="" for decorative images

---

## 11. Brand Asset Usage Rights

### 11.1 Internal Use

Team members may use Nexus brand assets for:
- Product development
- Internal presentations
- Training materials
- Internal communications

### 11.2 External Use

External use requires approval for:
- Marketing materials
- Partnership announcements
- Press releases
- Third-party integrations

### 11.3 Prohibited Use

**DO NOT:**
- Alter or modify brand assets
- Use in offensive or inappropriate contexts
- Imply endorsement without permission
- Use outdated or deprecated versions
- Create derivative works without authorization

---

## 12. Brand Evolution

### 12.1 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 29, 2026 | Initial brand guidelines (Purple theme) |
| 2.0 | Feb 13, 2026 | Updated to blue theme, added dark/light mode guidelines |

### 12.2 Changelog: Version 2.0

**Major Changes:**
- ✨ Primary color changed from purple (#667eea) to blue (#5D87FF)
- ✨ Added comprehensive dark mode color palette
- ✨ Added light mode color palette
- ✨ Expanded color system with Material Design scale
- ✨ Added design tokens (spacing, shadows, z-index)
- ✨ Added accessibility standards section
- ✨ Updated code syntax colors for both themes
- 📝 Improved typography guidelines
- 📝 Enhanced icon usage guidelines
- 📝 Added comprehensive UI component examples

**Deprecated:**
- ❌ Purple gradient (#667eea → #764ba2)
- ❌ Single-theme approach
- ❌ Purple variant colors

### 12.3 Future Considerations

As Nexus grows, we may explore:
- Animated logo variants for digital media
- Sound branding (audio logo, UI sounds)
- Seasonal color variants
- Product-specific sub-brands
- Expanded illustration system
- Custom icon set

---

## 13. Quick Reference

### Color Codes

```
Primary:   #5D87FF (Blue)
Secondary: #49BEFF (Cyan)
Success:   #13DEB9 (Teal)
Warning:   #FFAE1F (Gold)
Error:     #FA896B (Coral)
Info:      #49BEFF (Cyan)

Dark BG:   #2A3447
Light BG:  #F5F7FA
White:     #FFFFFF
Black:     #000000

Dark Text:    #EAEFF4 (primary), #7C8FAC (secondary)
Light Text:   #1F2937 (primary), #6B7280 (secondary)
```

### Fonts

```
Primary:   Inter (400, 500, 600, 700)
Code:      Fira Code
Sizes:     12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px
```

### Logo Sizes

```
Minimum:   150px (primary logo), 16px (icon)
Optimal:   200-300px (primary logo), 32-64px (icon)
```

### Spacing

```
Clear space: Equal to center node height
Grid:        8px base unit
Padding:     Multiples of 8px (8, 16, 24, 32, 48, 64)
Radius:      7px (standard), 16px (pills)
```

### Transitions

```
Fast:   150ms
Base:   200ms
Slow:   300ms
Easing: ease-in-out
```

---

## 14. Contact Information

### 14.1 Brand Inquiries

For questions about brand usage:

**Email:** brand@nexus.io
**Slack:** #brand-guidelines

### 14.2 Asset Requests

For custom assets or high-resolution files:

**Email:** design@nexus.io

### 14.3 License Questions

For licensing and partnership inquiries:

**Email:** legal@nexus.io

---

## 15. Appendix

### 15.1 Color Accessibility Table

| Foreground | Background | Contrast | WCAG Level | Use Case |
|------------|------------|----------|------------|----------|
| #1F2937 | #FFFFFF | 12.6:1 | AAA | Body text (light mode) |
| #EAEFF4 | #2A3447 | 11.8:1 | AAA | Body text (dark mode) |
| #5D87FF | #FFFFFF | 4.6:1 | AA | Large text only |
| #FFFFFF | #5D87FF | 4.6:1 | AA | White on blue buttons |
| #6B7280 | #FFFFFF | 4.6:1 | AA | Secondary text (light) |
| #7C8FAC | #2A3447 | 4.5:1 | AA | Secondary text (dark) |

### 15.2 Browser Support

**Minimum Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Font Feature Support:**
- Variable fonts: Progressive enhancement
- Font smoothing: All modern browsers
- Ligatures: Optional, gracefully degrade

### 15.3 Export Settings

**SVG Logos:**
- Outline all text
- Simplify paths
- Remove hidden layers
- Optimize with SVGO

**PNG Logos:**
- Export at 1x, 2x, 3x
- Use transparent background
- Optimize with TinyPNG

**Icon Exports:**
- 24x24px artboard (default)
- 2px stroke width
- Expand strokes before export
- Center align on artboard

---

**Document Version:** 2.0
**Created:** January 29, 2026
**Last Updated:** February 13, 2026
**Next Review:** August 13, 2026
**Authors:** Design Team, Development Team

---

© 2026 Nexus. All rights reserved.

**"Where Knowledge Connects"**
