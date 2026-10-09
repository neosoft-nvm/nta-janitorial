# NTA Janitorial - Modern Commercial Redesign

Production-ready, high-converting commercial cleaning web application built for **NTA Janitorial Cleaning Service** (North Brunswick, NJ | (732) 659-9648).

---

### Core Architecture & Key Modules
* **Tech Stack:** HTML5, Tailwind CSS (CDN), Lucide Icons, Vanilla JavaScript. Zero heavy dependencies or build steps.
* **Interactive Cost Estimator (`script.js`):** Dynamic monthly pricing calculator factoring in facility type, square footage (1,000–30,000+ sq ft), visit frequency (daily to bi-weekly), and specialty add-ons.
* **Before / After Comparison Slider (`script.js`):** Draggable before/after surface comparison for commercial floor stripping and deep cleaning.
* **Rapid Quote Modal & Lead Capture (`index.html`):** Lead generation form with prefilled facility scopes and instant toast confirmations.
* **Mobile Quick Action Bar:** Fixed bottom bar on mobile screens with one-tap calling (`(732) 659-9648`) and instant quote triggers.

---

### File Structure & Future Modification Guide
* **`index.html`:** Main landing page, business details, service cards, testimonials, FAQ, and modal markup.
* **`script.js`:** Rate calculations, square-footage pricing formulas, slider handlers, and form listeners.
  * *To adjust pricing:* Update base multipliers in `estimatorState` and calculation formulas in `calculateEstimate()`.
* **`style.css`:** Custom styling for range inputs, glassmorphism (`glass-panel`), and custom scrollbars.

---

### Deployment & Live Hosting
* **Repository:** `https://github.com/neosoft-nvm/nta-janitorial.git`
* **Live Hosting Target:** GitHub Pages (`main` branch, `/root` folder).
* **Live Production URL:** `https://neosoft-nvm.github.io/nta-janitorial/`
