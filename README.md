# anyone's QR gen & Digital Business Card Profile Builder

> **Domain:** [anyone's-QR_gen.me](https://anyone's-QR_gen.me)  
> **Architecture:** 100% Client-Side • Zero Database • Zero Tracking • Zero Subscriptions • Serverless Single-File Deployment

A high-performance, developer-grade suite of privacy-first utilities engineered to run completely in browser memory. Generate customizable vector QR codes and compile production-ready, standalone digital business card web pages ready for instant hosting on Netlify Drop or GitHub Pages.

---

## ⚡ Core Modules

### 1. QR Code Engine
High-density, reactive QR code generator with real-time vector rendering:
- **Instant Non-Blocking Updates:** Reactive canvas/SVG preview updates on every keystroke.
- **Protocol Presets:** Quick one-click formatters for `https://`, `mailto:`, `WIFI:`, and `tel:`.
- **Dynamic Color Matrix & WCAG Contrast Engine:** Native color wheels with calculated contrast ratios (Optimal, Fair, Low Scan) to guarantee scan reliability.
- **Geometric Module Styling:** Select between Smooth (Rounded), Circular (Dots), Fluid (Classy-Rounded), and Classic Square module patterns.
- **Corner Finder Eyes Customization:** Independent selection for corner frames (Extra Round, Circle, Square) and center eye dots.
- **Brand & Company Identifier Label:** Embed your company name or custom call-to-action ("SCAN ME") above or below the code with font family, size, letter spacing, and synchronized color controls.
- **Safe-Scan Central Logo Masking:** Drag & drop any SVG, PNG, JPG, or WebP logo into the central badge. Background dots are automatically masked out to eliminate optical scanning conflicts.
- **Multi-Format Export:**
  - **High-Res PNG:** High-density bitmap with custom brand text overlays.
  - **Vector SVG:** Infinite-resolution XML vector master for professional print.
  - **Copy Image:** One-click clipboard copy as a PNG blob.

---

### 2. Digital Business Card Profile Builder
A clean, pristine sandbox engine that compiles interactive, mobile-optimized digital business cards into a single self-contained HTML file:
- **Zero Hardcoded Data:** Launches as an unpopulated sandbox where every field is dynamically generated from user input.
- **Header Profile Details:** Fields for Full Name, Job Title, Company/Organization, Location Baseline, and Bio/Tagline.
- **Brand Identity Elements:** 1-px bordered upload zone for Headshots, Avatars, or Brand Logos, processed into compressed in-memory Base64 data strings.
- **Dynamic Theme Controls:** 
  - Dual color wheels for Background Base Color and Accent Branding Color.
  - One-click atmosphere presets: *Obsidian Night*, *Cyber Indigo*, *Deep Emerald*, *Velvet Rose*, and *Midnight Aurora*.
- **Dynamic Flex-Box Link Builder:**
  - Add unlimited interactive links with `+ Add Custom Link Box`.
  - Rich icon selector with 14+ inline SVGs (Website, LinkedIn, GitHub, X/Twitter, Instagram, YouTube, TikTok, Email, Phone, WhatsApp, Discord, Telegram, Portfolio, Custom).
  - Live title and destination URL editing with instant deletion.
- **Offline PDF / Document Embed:** Upload resumes, pitch decks, or portfolios. The PDF is serialized into Base64 and embedded directly into the standalone file for offline downloads.
- **vCard (`.vcf`) Generation:** Compiles RFC 6350 compliant contact cards downloadable on both desktop and mobile devices.
- **Bridge to QR Engine:** One-click button to pass your digital business card URL into the QR Code Engine to generate an accompanying scan code.

---

### 3. Interactive Fullscreen Live Preview Modal
Inspect and interact with your compiled business card before downloading:
- **Real Sandboxed Iframe:** Renders the exact standalone HTML that will be exported.
- **Device Viewport Toggle:** Switch seamlessly between **Mobile (380px phone chassis)** and **Desktop (full-width centered glassmorphic card)**.
- **Live Functional Testing:** Test clicking links, saving contacts via `.vcf`, and downloading embedded documents directly inside the preview.
- **Open in New Tab:** Spawn the compiled HTML into a live browser tab via an in-memory blob URL.

---

## 📱 Mobile-First Responsive Architecture

The entire application is built on an adaptive flexbox system designed to fit smoothly on any mobile browser (iOS Safari, Android Chrome, tablets):
- **Sticky Mobile Mode Switcher (`<= 1024px`):** Easily switch between **`[ Configure ]`** (editing controls) and **`[ Live Stage ]`** (live mockup preview) with one tap.
- **Mobile Stage Return Bar:** Quick "← Back to Controls" header to transition back into editing.
- **Adaptive Viewport Scaling:** Both the smartphone mockup frame and the logo stage frame scale fluidly with `width: min(100%, 340px)`.
- **Zero iOS Auto-Zoom:** Form fields are configured with `16px` base sizing to eliminate disruptive automatic zooming on iOS devices.
- **Touch-Optimized Controls:** Minimum 44px touch targets across buttons, swatches, and dropdowns.

---

## 🚀 The Zero-Cost Serverless Export Blueprint

When clicking **"Download Hostable Card Layout (HTML)"**, the engine dynamically compiles a single `index.html` file containing:
1. Complete HTML5 semantic structure and meta tags.
2. Inlined Google Fonts (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`).
3. Fully inlined CSS styles, theme variables, glassmorphic filters, and hover micro-interactions.
4. The user's Base64 profile avatar and Base64 PDF attachment.
5. All custom links rendered as clean semantic `<a>` tags with inlined SVG icons.
6. An inlined client-side JavaScript routine that generates and downloads a `.vcf` contact file on demand.

### Instant Hosting Instructions
1. Download the generated `index.html` file.
2. Drag and drop the file directly onto [Netlify Drop](https://app.netlify.com/drop).
3. Alternatively, push it to a [GitHub Pages](https://pages.github.com/) repository or upload to Vercel/Cloudflare Pages.
4. Your digital business card is live on the web instantly—no server setup, no database, and zero monthly costs.

---

## 🛠️ Project Structure

```text
├── index.html          # Application entry point, console panels, and preview stages
├── style.css           # Modern design system, glassmorphic effects, and responsive breakpoints
├── app.js              # 100% client-side reactive engine, FileReader pipelines, and compiler
├── metadata.json       # Applet configuration and capabilities
├── package.json        # Dependencies and build scripts
└── public/
    ├── anyones-qr-gen_logo.svg   # Official custom brand logo artwork
    └── custom-logo-icon.svg      # Official brand icon emblem
```

---

## 💻 Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Run TypeScript and code linting
npm run lint
```

---

## 🔒 Privacy & Security Guarantee

- **No Remote Storage:** All images, logos, PDFs, contact data, and URLs remain strictly in local browser memory.
- **Zero Analytics & Tracking:** No third-party tracking scripts, cookies, telemetry, or user fingerprinting.
- **Client-Side Compilation:** Every byte of exported HTML and PNG/SVG files is rendered natively via standard Web APIs (`FileReader`, `CanvasRenderingContext2D`, `Blob`, `URL.createObjectURL`).

---

## 📄 License
MIT License. Free to use, modify, and distribute for personal and commercial projects.
