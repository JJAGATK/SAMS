# SAMS — Student Attendance Monitoring System

A simple, clean web application designed to track student attendance and highlight students who may need academic support early before they miss too many classes.

## The Problem
Colleges often identify students with poor attendance only after they have missed many classes, making timely intervention difficult.

## The Objective
Develop a web application that analyzes attendance records and highlights students who may need academic support.

---

## Core Features
1. **Teacher Login & Student Portal:** Switch between full teacher controls and student personal attendance cards.
2. **Attendance Entry & Import:** Form to record attendance for any student or reset sample records with one click.
3. **Attendance Percentage Calculation:** Formula `(Classes Attended / Total Classes) * 100` dynamically calculated.
4. **Risk Indicators:** Clear status badges marking students as **Safe** (&ge; 75%) or **Needs Support** (&lt; 75%).
5. **Filters by Course & Semester:** Filter student records by branch (Computer Science, IT, Electronics) and semester.
6. **Student History:** View past attendance records and breakdown for each student.
7. **Academic Support Alerts:** Dedicated alert section highlighting students who have fallen below the 75% attendance threshold.
8. **Dashboard Overview:** Summary cards displaying Total Students, Average Attendance %, and count of students needing support.
9. **Report Export:** Download a complete attendance summary spreadsheet (`sams_attendance_report.csv`).

---

## Tech Stack
- **HTML5:** Semantic, clean structure.
- **CSS3:** Modern, clean, responsive design without any external CSS frameworks.
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
   - **Name:** `sams-attendance`
   - **Runtime:** `Node`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`
4. Click **Deploy Web Service**.
