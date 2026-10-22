# Prakriti Ayurvedic Blueprint Portal 🌿

An elegant, fully-responsive, and clinically-detailed Ayurvedic constitutional diagnosis portal with instant client-side calculation, bilingual Marathi support, interactive 1-month progress charts, constitutional health risk evaluation, and personalized recommendations based on demographic measurements.

---

## ✨ Features

- **Self-Contained & Instant (No Database or Server AI Required):**
  - All Ayurvedic diagnostic logic is computed directly on the client side using classical Ayurvedic principles.
  - Deploys effortlessly to **Vercel**, **GitHub Pages**, **Netlify**, or any static host with **zero configuration or API keys required**.
  - Will never fail or report "Analysis failed" during online deployments.

- **Secure Sign-In Interface:**
  - Hidden collapsible **Demo Credentials Box** containing secure login info:
    - **Username:** `user1@gmail.com`
    - **Password:** `123456`
  - Fully implements a **"Save Temporarily" Toggle (Session storage vs Local storage)** which dynamically prevents long-term storage and clears all session state immediately when closing the browser tab or signing out.

- **Demographic Measurement Integration:**
  - Captures **Full Name**, **Age**, **Height (cm)**, and **Gender** upon signing in.
  - Tailors yoga poses, physical exertion levels, and constitutional risk assessment to your physical profile.

- **Comprehensive 6-Tab Diagnostic Interface:**
  1. **Summary:** Displays dominant dosha(s), percentage chart, 1-month retest progress graph, and holistic description.
  2. **Avoid Foods:** Precise, dosha-aggravating foods that should be strictly avoided or limited.
  3. **Precautions:** Crucial daily warnings, habits, and environmental triggers to look out for.
  4. **Tips:** General helpful health suggestions, remedies, and wellness modifications.
  5. **Yoga & Exercise:** Specific yoga asanas, physical poses, and quick exercise movements optimized for your age and physical frame.
  6. **Causes:** Root physiological, metabolic, and lifestyle reasons behind your doshic imbalances.

- **1-Month Comparative Progress Graph:**
  - Simulates a **1-Month Retest** showing how daily adherence to the lifestyle prescription successfully stabilizes and balances your baseline doshic proportions toward optimal equilibrium.

- **Constitutional Health Risk Percentage Dial:**
  - Calculates a demographic and constitution-based **Health Risk Percentage** (0% - 100%) indicating current vulnerability to developing dosha-specific physical or metabolic complications.
  - Features a visually polished circular progress gauge colored conditionally (Green for Low Risk, Amber for Moderate, Red for High Risk).

- **Offline Text-to-Speech (Audio Voice):**
  - Reads your constitutional diagnosis aloud using the built-in browser Speech Synthesis API with zero latency and no external server.

- **Full Marathi Bilingual Localization:**
  - Instant toggle between English and Marathi for all UI elements, quiz questions, and clinical analysis details.

---

## 🚀 Quick Start & Deployment

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build for production:
   ```bash
   npm run build
   ```
3. Start the local server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:3000`.
