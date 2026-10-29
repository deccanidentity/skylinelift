# Skyline Elevators — Corporate Static Website

Premium, modern, and fully responsive multi-page static corporate website for **Skyline Elevators** (ISO 9001:2015 Certified), an elevator solutions provider based in **BHEL, Ramachandrapuram, Hyderabad, Telangana – 502032**.

Built with semantic **HTML5**, **CSS3**, and modular **Vanilla JavaScript**—requiring **no backend, no server, and no build step**. Every page works both by opening the `.html` files directly in a browser (`file://`) and when hosted on **GitHub Pages**.

---

## 1. Strict Page Separation & Minimal Navigation Menu

The website uses a focused 5-item navigation bar with strict page separation:

1. **Home ([`index.html`](index.html)):** Hero overview, executive summary of the Products & Services divisions, core company strengths, and call-to-action banner.
2. **Products ([`products.html`](products.html)):** Dedicated exclusively to **Elevator Products & Drive Technologies**—Passenger Elevators, Home & Villa Elevators, Hospital Lifts, Goods Elevators, MRL / Traction / Hydraulic Drive Systems, and Touchfeel LOP & COP Controls.
3. **Services ([`services.html`](services.html)):** Dedicated exclusively to **Elevator Lifecycle Services**—New Elevator Installation & Commissioning, Elevator Modernization & Upgrades, Preventive Maintenance & Repair, and our 4-Step Engagement Approach.
4. **About Us ([`about.html`](about.html)):** Dedicated to the Skyline Elevators company profile, ISO 9001:2015 quality commitment, *Why Choose Skyline Elevators?* strengths, and the visual showcase gallery with native `<dialog>` lightbox.
5. **Contact ([`contact.html`](contact.html)):** Dedicated to corporate office details (BHEL, Ramachandrapuram, Hyderabad), clickable telephone links (`9553388005` / `9553388006`), Google Maps search destination, and the interactive Enquiry Form (with automatic `?item=...` product/service pre-selection).

---

## 2. Folder Structure

```text
skylinelift/
├── index.html          # Home page
├── products.html       # Dedicated Elevator Products & Drive Technologies page
├── services.html       # Dedicated Installation, Modernization & Maintenance Services page
├── about.html          # Dedicated Company Profile, Strengths & Showcase Gallery page
├── contact.html        # Dedicated Corporate Contact, Map & Enquiry Form page
├── 404.html            # Custom 404 error page
├── .nojekyll           # GitHub Pages static asset configuration
├── README.md           # Project documentation
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── main.js
    ├── images/
    │   ├── skyline-logo.png
    │   ├── skyline-logo-white.png
    │   ├── hero-elevator.webp
    │   ├── about-elevator.webp
    │   ├── office-hyderabad.webp
    │   ├── services/
    │   │   ├── passenger-elevators.webp
    │   │   ├── home-villa-elevators.webp
    │   │   ├── hospital-elevators.webp
    │   │   ├── goods-elevators.webp
    │   │   └── elevator-systems.webp
    │   └── projects/
    │       ├── corporate-office-bhel.webp
    │       ├── commercial-lobby-finish.webp
    │       ├── passenger-cabin-interior.webp
    │       └── villa-home-elevator.webp
    └── icons/
        ├── favicon.svg
        └── favicon.png
```

---

## 3. Opening Locally (Without a Server)

Because all links (`href="products.html"`, `href="services.html"`, `src="assets/..."`) are strictly relative static file paths:
- You can **double-click `index.html`** directly in Finder / File Explorer to open and navigate the entire website in your browser (`file://`) with **no server required**.

---

## 4. GitHub Pages Deployment

1. **Commit and push the code to the `main` branch:**
   ```bash
   git add .
   git commit -m "Update Skyline Elevators logo and separate static pages"
   git push -u origin main
   ```
2. **Enable GitHub Pages in Repository Settings:**
   - Open your GitHub repository → **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
   - Select **`main`** and **`/ (root)`**, then click **Save**.

3. **Google Review here:**
   -  https://share.google/LCw8Ih9ScrXM3Ev1n
    
