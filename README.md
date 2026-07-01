# MARULA. — Coffee House Website

A responsive B2C website with a live demo booking system, built for the CommunityBytes Access technical assessment.

## Live demo
- Vercel: _add your deployed URL here_
- Repo: _add your GitHub URL here_

## Preview
<!-- Add a real screenshot before submitting. Drag an image into
     this repo (e.g. /images/preview.png) and reference it below: -->
![MARULA preview](images/preview.png)

## Overview
MARULA. is a fictional neighbourhood coffee house. The site covers Home, Menu, Gallery, About, Contact, and a fully interactive demo Booking flow.

## Tech stack
- HTML5, CSS3 (custom properties, no framework/build step)
- Vanilla JavaScript (no libraries)
- Fonts: Fraunces, Work Sans, IBM Plex Mono (Google Fonts)
- Deployed on Vercel as a static site

## Features
- Responsive layout (mobile / tablet / desktop)
- Accessible markup: semantic HTML, labelled form fields, visible focus states, `aria-live` booking status announcements
- Booking system:
  - Month calendar with past dates and the weekly closed day (Monday) disabled and visually distinct
  - Time slots generated from configured opening hours, auto-disabling past times on the current day
  - Inline form validation (name, phone, party size) with no dead-end states
  - Confirmation screen with a pre-filled WhatsApp message via `wa.me`
  - "Make another booking" reset flow

## Project structure
```
marula/
├── index.html
├── menu.html
├── gallery.html
├── about.html
├── contact.html
├── booking.html
├── css/
│   └── style.css
├── js/
│   ├── nav.js       # mobile nav toggle (all pages)
│   └── booking.js   # calendar, slots, validation, confirmation
└── images/
```

## Setup
No build step required.
```
# open directly, or serve locally:
npx serve .
```

## Configuration
Business hours, closed days, slot length, and the demo WhatsApp number live at the top of `js/booking.js`:
```js
const WHATSAPP_NUMBER = "27600000000"; // replace with your demo number
const CLOSED_WEEKDAYS = [1];           // 0=Sun ... 6=Sat
const OPEN_HOUR = 8;
const CLOSE_HOUR = 17;
const SLOT_MINUTES = 45;
```

## What I'd build next
- Swap placeholder `[ photo: ... ]` blocks for real photography with meaningful alt text
- Persist bookings server-side (this version is a client-only demo, matching the brief)
- Add a lightbox to the gallery
