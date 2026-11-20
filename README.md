# Student Attendance Risk Predictor

A minimal, clean web application that analyzes attendance records and highlights students who may need academic support.

## Problem Statement
Colleges often identify students with poor attendance only after they have missed many classes, making timely intervention difficult.

## Objective
Develop a web application that analyzes attendance records and highlights students who may need academic support.

## Key Features
- **Student login / Admin login:** Toggle between full admin management and individual student personal view.
- **Attendance entry / import:** Form to manually record attendance or import sample records with one click.
- **Attendance percentage calculation:** Formula-driven `(attended / total) * 100` dynamically calculated.
- **Risk indicators:** Visual cues marking students as **Needs Support** (< 75%) or **Safe** (≥ 75%).
- **Filters by course / semester:** Dropdowns to filter by Course, Semester, and Risk Level.
- **Student history:** Drill-down view displaying past attendance breakdown and subject-wise logs.
- **Alerts:** Automated warning panel highlighting students falling below the 75% threshold.
- **Dashboard:** Clean summary cards displaying Total Enrolled, Class Average %, and At-Risk Count.
- **Report export:** One-click CSV report export for academic committees and faculty records.

## Tech Stack
- HTML5 (Semantic & Accessible)
- CSS3 (Clean, responsive layout)
- Vanilla JavaScript (ES6+, zero external dependencies)
- Node.js (Built-in HTTP server for local hosting & Render deployment)

---

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/JJAGATK/student-attendance-risk-predictor.git
   cd student-attendance-risk-predictor
   ```
2. Start the local server:
   ```bash
   node server.js
   ```
   *(or run `npm start`)*
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Deploying to Render (Free)

### Method 1: Web Service (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub account and select this repository: `JJAGATK/student-attendance-risk-predictor`.
3. Configure the settings:
   - **Name:** `student-attendance-risk-predictor`
   - **Runtime:** `Node`
   - **Build Command:** *(leave empty)*
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
4. Click **Deploy Web Service**.

### Method 2: Static Site
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Static Site**.
2. Connect this repository: `JJAGATK/student-attendance-risk-predictor`.
3. Configure:
   - **Build Command:** *(leave empty)*
   - **Publish Directory:** `.`
4. Click **Create Static Site**.
