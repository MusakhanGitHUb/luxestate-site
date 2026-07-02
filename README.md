# LuxEstate — Premium Real Estate Website

A modern, responsive, performance-focused real estate/property business website built with semantic HTML, CSS, and vanilla JavaScript. The structure is intentionally dependency-free so it loads fast, is easy to maintain, and can be connected later to a CMS, backend, or admin panel.

## Features

- Premium hero section with strong value proposition and CTA buttons
- Responsive navigation with accessible mobile menu
- Data-driven property listings from `data/properties.js`
- Advanced property filtering by location, type, price, size, bedrooms, and availability
- Sorting by featured, price, and size
- Dynamic property detail page using `property.html?id=property-id`
- Interactive property gallery with lightbox
- Amenities, floor plan, pricing, descriptions, maps, and inquiry form
- About, services, testimonials, contact, social links, and map integration
- Scroll-triggered reveal animations and lightweight parallax
- Reduced-motion support for accessibility
- Semantic HTML, SEO metadata, and structured data
- Mobile-first responsive layout
- CMS-ready content model

## Folder Structure

```text
luxestate-site/
├── index.html
├── property.html
├── data/
│   └── properties.js
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
└── README.md
```

## Running Locally

Because this project uses plain HTML/CSS/JS, you can open `index.html` directly in a browser. For the best experience, run it with a local static server:

```bash
cd luxestate-site
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## How to Add or Edit Properties

Open `data/properties.js` and update the `window.PROPERTIES` array. Each property has this structure:

```js
{
  id: "unique-property-id",
  title: "Property Name",
  location: "Area Name",
  address: "Full address",
  price: "$1,450,000",
  priceValue: 1450000,
  type: "Apartment",
  size: 1850,
  bedrooms: 3,
  bathrooms: 3,
  availability: "For Sale",
  featured: true,
  description: "Property description...",
  amenities: ["Gym", "Pool", "Concierge"],
  floorPlan: "3 bedrooms • 3 bathrooms...",
  coordinates: "Map search location",
  images: ["image-url-1", "image-url-2"]
}
```

## CMS / Backend Integration Notes

This project is prepared for future CMS and backend growth:

- Replace `data/properties.js` with an API call from a CMS such as Sanity, Strapi, Contentful, WordPress, or a custom backend.
- Connect inquiry forms to a CRM, email service, or lead management API.
- Add authentication and admin dashboard for property creation/editing.
- Add analytics tracking for CTA clicks, property views, search filters, and lead submissions.
- Add image CDN transformations for production optimization.

## Recommended Production Improvements

- Host images through a CDN with WebP/AVIF variants.
- Add server-side rendering or static generation if moving to Next.js/Astro.
- Add real form validation and spam protection.
- Connect Google Maps through an official API key for richer maps.
- Add sitemap.xml and robots.txt.
- Add Open Graph images for every detail page.
- Add test coverage if converting to a component framework.

## Accessibility Notes

- Keyboard-accessible mobile menu and gallery lightbox
- Semantic landmarks and headings
- Visible focus styles
- Skip-to-content link
- Reduced-motion support
- Meaningful alt text for property imagery

## Browser Support

The site uses modern CSS and JavaScript supported by current versions of Chrome, Edge, Firefox, and Safari.

## Application / PWA Setup

This project is now prepared as an installable Progressive Web App.

### Run the website locally

```bash
cd luxestate-site
python -m http.server 8080
```

Open `http://localhost:8080` in Chrome, Edge, or Safari. On supported browsers, use **Install App** or **Add to Home Screen** to install LuxEstate like an app.

### Build static app files

```bash
npm run build
```

The build output is created in:

```text
www/
```

### Android app with Capacitor

Install packages first:

```bash
npm install
```

Then create and open the Android app:

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Android Studio will open the generated Android project. From there, run the emulator or create an APK/AAB.

### Files added for app readiness

- `manifest.webmanifest` for installable app metadata
- `service-worker.js` for offline caching
- `offline.html` for offline fallback
- `assets/js/pwa.js` for service worker registration and install prompt
- `assets/icons/` for app icons and Apple touch icon
- `package.json` for local/build/Capacitor scripts
- `capacitor.config.ts` for Android/iOS app wrapping
- `scripts/build-static.mjs` to create the `www/` app bundle
