# SAMS — Student Attendance Monitoring System

A clean, modern, and professional web application designed to track student attendance and highlight students who may need academic support early before they miss too many classes.

## The Problem
Colleges often identify students with poor attendance only after they have missed many classes, making timely intervention difficult.

## The Objective
Develop a web application that analyzes attendance records and highlights students who may need academic support.

---

## Authentication & Access Control

### 1. Teacher / Admin Portal
* Full access to class-wide analytics and tools.
* **Username:** `admin`
* **Password:** `admin123`
* **Features:** Record and update attendance, view all students, filter by course and semester, review academic support alerts, reset sample data, and export CSV reports.

### 2. Student Portal (Role-based Isolation)
* Students **only see their own attendance records and personal metrics** (they cannot see other students' details, class tables, or administrative tools).
* **Sample Student Credentials:**
  - Roll No: `CS-101` (Aarav Patel) &bull; Password: `1234` *(At Risk: 62.5%)*
  - Roll No: `CS-102` (Rohan Verma) &bull; Password: `1234` *(Safe: 90.0%)*
  - Roll No: `IT-201` (Sneha Mukherjee) &bull; Password: `1234` *(At Risk: 68.0%)*
* **Student Features:**
  - Personal attendance overview: Total conducted, attended, missed, and calculated attendance percentage.
  - Eligibility & Risk Badge (`Safe` vs `Needs Support`).
  - Tailored guidance note (including exact consecutive classes needed to reach 75% if in the warning zone).
  - Subject-by-subject attendance breakdown for their enrolled courses.

---

## Tech Stack
- **HTML5:** Semantic, clean structure.
- **CSS3:** Modern system typography (`-apple-system`, `Segoe UI`, `Roboto`), responsive card layout, zero frameworks.
- **Vanilla JavaScript:** Clean, readable, beginner-friendly functions with zero dependencies.
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
