# AttendTrack — Student Attendance & Academic Support System

A clean, modern, and minimal web application designed to track student attendance and identify students who need academic support before they miss too many classes.

## The Problem
Colleges often identify students with poor attendance only after they have missed many classes, making timely intervention difficult.

## Our Objective
Develop a web application that analyzes attendance records and highlights students who may need academic support.

---

## Key Features
- **Student Login / Teacher Login:** Switch between full administrative controls and individual student personal view.
- **Attendance Entry & Import:** Easily record attendance for any student or reset sample records with one click.
- **Attendance Percentage Calculation:** Automatically calculates `(Classes Attended / Total Classes) * 100`.
- **Risk Indicators:** Clear status badges marking students as **Safe** (&ge; 75%) or **Needs Support** (&lt; 75%).
- **Filters by Course & Semester:** Filter student records by branch (Computer Science, IT, Electronics), semester (1 through 6), and risk status.
- **Student History:** View past class logs and attendance breakdown for each student.
- **Academic Support Alerts:** Dedicated alert section highlighting students who have fallen below the 75% attendance threshold.
- **Dashboard Overview:** Clean summary cards displaying Total Students, Average Attendance %, and count of students needing support.
- **Report Export:** Download a complete attendance summary spreadsheet (`attendtrack_report.csv`) with one click.

---

## Tech Stack
- **HTML5:** Semantic, clean structure.
- **CSS3:** Modern, responsive design without any external CSS frameworks.
- **Vanilla JavaScript:** Clean, readable functions with zero dependencies.
- **Node.js:** Lightweight built-in server for local hosting and Render deployment.

---

## Running Locally

1. Start the server:
   ```bash
   node server.js
   ```
2. Open your web browser and go to:
   ```
   http://localhost:3000
   ```

---

## Deploying to Render (Free)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository: `JJAGATK/student-attendance-risk-predictor`.
3. Set the following:
   - **Name:** `attendtrack`
   - **Runtime:** `Node`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`
4. Click **Deploy Web Service**.
