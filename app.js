/**
 * SAMS - Student Attendance Monitoring System
 * Simple, Clean Vanilla JavaScript
 * 
 * Features:
 * - Proper Login Page for Teachers and Students
 * - Role-based Views: Students only see their own attendance details
 * - Dynamic Attendance Percentage & Risk Calculation
 * - Academic Support Alerts (< 75%)
 * - Filters by Course & Semester
 * - Export Report to CSV
 */

// ==========================================================================
// 1. DATA: Teacher Account & Sample Student Records
// ==========================================================================

// Teacher / Admin credentials
const teacherAccount = {
  username: "admin",
  password: "admin123",
  displayName: "Faculty / Admin"
};

// Initial list of students
const initialStudents = [
  {
    rollNo: "CS-101",
    name: "Aarav Patel",
    password: "1234",
    course: "Computer Science",
    semester: "5",
    totalClasses: 40,
    attendedClasses: 25, // 62.5% -> Needs Support (< 75%)
    history: [
      { period: "Month 1", subject: "Data Structures", record: "Attended 13 / 20" },
      { period: "Month 2", subject: "Database Systems", record: "Attended 12 / 20" }
    ]
  },
  {
    rollNo: "CS-102",
    name: "Rohan Verma",
    password: "1234",
    course: "Computer Science",
    semester: "5",
    totalClasses: 40,
    attendedClasses: 36, // 90.0% -> Safe (>= 75%)
    history: [
      { period: "Month 1", subject: "Data Structures", record: "Attended 18 / 20" },
      { period: "Month 2", subject: "Database Systems", record: "Attended 18 / 20" }
    ]
  },
  {
    rollNo: "IT-201",
    name: "Sneha Mukherjee",
    password: "1234",
    course: "Information Technology",
    semester: "3",
    totalClasses: 50,
    attendedClasses: 34, // 68.0% -> Needs Support (< 75%)
    history: [
      { period: "Month 1", subject: "Computer Networks", record: "Attended 17 / 25" },
      { period: "Month 2", subject: "Web Technologies", record: "Attended 17 / 25" }
    ]
  },
  {
    rollNo: "IT-202",
    name: "Vikram Malhotra",
    password: "1234",
    course: "Information Technology",
    semester: "3",
    totalClasses: 50,
    attendedClasses: 45, // 90.0% -> Safe (>= 75%)
    history: [
      { period: "Month 1", subject: "Computer Networks", record: "Attended 23 / 25" },
      { period: "Month 2", subject: "Web Technologies", record: "Attended 22 / 25" }
    ]
  },
  {
    rollNo: "EC-301",
    name: "Ananya Iyer",
    password: "1234",
    course: "Electronics",
    semester: "5",
    totalClasses: 45,
    attendedClasses: 31, // 68.9% -> Needs Support (< 75%)
    history: [
      { period: "Month 1", subject: "Digital Electronics", record: "Attended 15 / 22" },
      { period: "Month 2", subject: "VLSI Circuits", record: "Attended 16 / 23" }
    ]
  }
];

// Active copy of data in memory
let students = JSON.parse(JSON.stringify(initialStudents));

// Stores the currently logged in user { role: 'teacher' | 'student', studentData?: student }
let currentUser = null;

// ==========================================================================
// 2. MATH HELPERS: Percentage & Risk Status
// ==========================================================================

// Calculates: (Attended / Total) * 100
function getPercentage(attended, total) {
  if (total <= 0) return 0;
  let percent = (attended / total) * 100;
  return percent.toFixed(1); // e.g. "62.5"
}

// College 75% rule
function getRiskStatus(percentage) {
  let num = parseFloat(percentage);
  if (num < 75.0) {
    return {
      label: "Needs Support",
      badgeClass: "badge-danger",
      isAtRisk: true
    };
  } else {
    return {
      label: "Safe",
      badgeClass: "badge-safe",
      isAtRisk: false
    };
  }
}

// Calculates how many future classes student must attend without missing any to reach 75%
function getClassesNeededFor75(attended, total) {
  let required = Math.ceil((0.75 * total - attended) / 0.25);
  return Math.max(0, required);
}

// ==========================================================================
// 3. AUTHENTICATION & LOGIN SCREEN
// ==========================================================================

// Tab switching between Teacher and Student login
const tabTeacher = document.getElementById("tabTeacher");
const tabStudent = document.getElementById("tabStudent");
const formTeacherLogin = document.getElementById("formTeacherLogin");
const formStudentLogin = document.getElementById("formStudentLogin");

tabTeacher.addEventListener("click", function() {
  tabTeacher.classList.add("active");
  tabStudent.classList.remove("active");
  formTeacherLogin.style.display = "flex";
  formStudentLogin.style.display = "none";
});

tabStudent.addEventListener("click", function() {
  tabStudent.classList.add("active");
  tabTeacher.classList.remove("active");
  formStudentLogin.style.display = "flex";
  formTeacherLogin.style.display = "none";
});

// Teacher Login Form Submit
formTeacherLogin.addEventListener("submit", function(e) {
  e.preventDefault();
  let user = document.getElementById("teacherUsername").value.trim();
  let pass = document.getElementById("teacherPassword").value.trim();

  if (user === teacherAccount.username && pass === teacherAccount.password) {
    currentUser = {
      role: "teacher",
      displayName: teacherAccount.displayName
    };
    renderApp();
  } else {
    alert("Invalid Teacher credentials. Use admin / admin123");
  }
});

// Student Login Form Submit
formStudentLogin.addEventListener("submit", function(e) {
  e.preventDefault();
  let roll = document.getElementById("studentRoll").value.trim().toUpperCase();
  let pass = document.getElementById("studentPassword").value.trim();

  // Find the student by roll number
  let foundStudent = null;
  for (let i = 0; i < students.length; i++) {
    if (students[i].rollNo.toUpperCase() === roll) {
      foundStudent = students[i];
      break;
    }
  }

  if (foundStudent && pass === foundStudent.password) {
    currentUser = {
      role: "student",
      studentData: foundStudent
    };
    renderApp();
  } else {
    alert("Invalid Student Roll Number or Password. Example: CS-101 / 1234");
  }
});

// Logout Button
document.getElementById("btnLogout").addEventListener("click", function() {
  currentUser = null;
  renderApp();
});

// Controls what screen is displayed based on currentUser
function renderApp() {
  const loginScreen = document.getElementById("loginScreen");
  const mainAppContent = document.getElementById("mainAppContent");
  const navUserBox = document.getElementById("navUserBox");
  const navUserName = document.getElementById("navUserName");

  const teacherView = document.getElementById("teacherDashboardView");
  const studentView = document.getElementById("studentPersonalView");

  // CASE 1: Logged Out
  if (!currentUser) {
    loginScreen.style.display = "flex";
    mainAppContent.style.display = "none";
    navUserBox.style.display = "none";
    return;
  }

  // CASE 2: Logged In
  loginScreen.style.display = "none";
  mainAppContent.style.display = "block";
  navUserBox.style.display = "flex";

  if (currentUser.role === "teacher") {
    // Show Teacher View; Hide Student View
    navUserName.textContent = "Teacher: Admin";
    teacherView.style.display = "block";
    studentView.style.display = "none";

    // Refresh Teacher tables & metrics
    updateDashboard();
    renderTable();
    updateAlerts();
  } else if (currentUser.role === "student") {
    // Show Student View ONLY; Hide Teacher View completely
    navUserName.textContent = "Student: " + currentUser.studentData.name;
    teacherView.style.display = "none";
    studentView.style.display = "block";

    // Populate the student's personal details
    renderStudentPersonalDashboard(currentUser.studentData);
  }
}

// ==========================================================================
// 4. STUDENT PERSONAL VIEW (Only sees their own attendance!)
// ==========================================================================
function renderStudentPersonalDashboard(student) {
  let pct = getPercentage(student.attendedClasses, student.totalClasses);
  let missed = student.totalClasses - student.attendedClasses;
  let risk = getRiskStatus(pct);

  // Student Header
  document.getElementById("stuGreetingName").textContent = `Welcome, ${student.name}`;
  document.getElementById("stuMetaDetails").textContent = `${student.course} • Semester ${student.semester} • Roll No: ${student.rollNo}`;

  // Badge
  document.getElementById("stuRiskBadgeContainer").innerHTML = `
    <span class="badge ${risk.badgeClass}" style="font-size: 13px; padding: 6px 12px;">${risk.label}</span>
  `;

  // Summary Metrics
  document.getElementById("stuTotalHeld").textContent = student.totalClasses;
  document.getElementById("stuTotalAttended").textContent = student.attendedClasses;
  document.getElementById("stuTotalMissed").textContent = missed;
  document.getElementById("stuPercentage").textContent = `${pct}%`;

  // Notice Alert Banner
  const noticeBanner = document.getElementById("stuNoticeBanner");
  if (risk.isAtRisk) {
    let needed = getClassesNeededFor75(student.attendedClasses, student.totalClasses);
    noticeBanner.className = "student-notice-card notice-danger";
    noticeBanner.innerHTML = `
      <strong>Academic Support Notice:</strong> Your attendance is currently <strong>${pct}%</strong>, which is below the mandatory 75% college requirement.
      <br>To get back into the safe zone, you must attend the next <strong>${needed} consecutive classes</strong> without being absent. Please meet your faculty advisor for guidance.
    `;
  } else {
    noticeBanner.className = "student-notice-card notice-safe";
    noticeBanner.innerHTML = `
      <strong>Good Standing:</strong> Your attendance is <strong>${pct}%</strong> and meets the college examination eligibility requirement. Keep it up!
    `;
  }

  // Student's own subject history table
  const subjectTbody = document.getElementById("stuSubjectTableBody");
  subjectTbody.innerHTML = "";

  let logs = student.history || [];
  if (logs.length === 0) {
    subjectTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:12px; color:#64748b;">No subject history recorded yet.</td></tr>`;
    return;
  }

  for (let i = 0; i < logs.length; i++) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${logs[i].period}</td>
      <td><strong>${logs[i].subject}</strong></td>
      <td>${logs[i].record}</td>
    `;
    subjectTbody.appendChild(tr);
  }
}

// ==========================================================================
// 5. TEACHER DASHBOARD: Summary Statistics
// ==========================================================================
function updateDashboard() {
  let totalStudents = students.length;
  let sumPercentage = 0;
  let atRiskCount = 0;

  for (let i = 0; i < students.length; i++) {
    let s = students[i];
    let pct = parseFloat(getPercentage(s.attendedClasses, s.totalClasses));
    sumPercentage += pct;

    if (pct < 75.0) {
      atRiskCount++;
    }
  }

  let average = totalStudents > 0 ? (sumPercentage / totalStudents).toFixed(1) : "0.0";

  document.getElementById("totalStudentsCount").textContent = totalStudents;
  document.getElementById("averageAttendancePercent").textContent = average + "%";
  document.getElementById("atRiskStudentsCount").textContent = atRiskCount;
}

// ==========================================================================
// 6. TEACHER TABLE: Render All Student Rows with Filters
// ==========================================================================
function renderTable() {
  const tableBody = document.getElementById("attendanceTableBody");
  const selectedCourse = document.getElementById("courseFilter").value;
  const selectedSemester = document.getElementById("semesterFilter").value;
  const selectedRisk = document.getElementById("riskFilter").value;

  // Filter students based on dropdowns
  const filtered = students.filter(function(s) {
    let pct = parseFloat(getPercentage(s.attendedClasses, s.totalClasses));
    let isRisk = pct < 75.0;

    let matchCourse = (selectedCourse === "ALL") || (s.course === selectedCourse);
    let matchSemester = (selectedSemester === "ALL") || (s.semester === selectedSemester);
    let matchRisk = (selectedRisk === "ALL") || 
                    (selectedRisk === "RISK" && isRisk) || 
                    (selectedRisk === "SAFE" && !isRisk);

    return matchCourse && matchSemester && matchRisk;
  });

  document.getElementById("tableRecordCount").textContent = `Showing ${filtered.length} of ${students.length} students`;
  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:16px; color:#64748b;">No matching records found.</td></tr>`;
    return;
  }

  for (let i = 0; i < filtered.length; i++) {
    let s = filtered[i];
    let pct = getPercentage(s.attendedClasses, s.totalClasses);
    let risk = getRiskStatus(pct);

    let row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${s.rollNo}</strong></td>
      <td>${s.name}</td>
      <td>${s.course}</td>
      <td>Semester ${s.semester}</td>
      <td class="text-center">${s.totalClasses}</td>
      <td class="text-center"><strong>${s.attendedClasses}</strong></td>
      <td class="text-center"><strong>${pct}%</strong></td>
      <td><span class="badge ${risk.badgeClass}">${risk.label}</span></td>
      <td class="text-center">
        <button type="button" class="btn btn-outline btn-sm" onclick="openStudentHistory('${s.rollNo}')">
          View History
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  }
}

// ==========================================================================
// 7. TEACHER ALERTS: Highlighting Students Below 75%
// ==========================================================================
function updateAlerts() {
  const container = document.getElementById("alertsContainer");
  container.innerHTML = "";

  let count = 0;
  for (let i = 0; i < students.length; i++) {
    let s = students[i];
    let pct = parseFloat(getPercentage(s.attendedClasses, s.totalClasses));

    if (pct < 75.0) {
      count++;
      let alertItem = document.createElement("div");
      alertItem.className = "alert-card";
      alertItem.innerHTML = `
        <div>
          <strong>${s.name} (${s.rollNo})</strong> &mdash; ${s.course}, Semester ${s.semester}
        </div>
        <div>
          Attendance: <strong>${pct}%</strong> (Needs Academic Support)
        </div>
      `;
      container.appendChild(alertItem);
    }
  }

  if (count === 0) {
    container.innerHTML = `<p style="color:#15803d; font-size:13px;">All students meet the 75% attendance requirement.</p>`;
  }
}

// ==========================================================================
// 8. STUDENT HISTORY MODAL (For Teacher View)
// ==========================================================================
function openStudentHistory(rollNo) {
  let student = null;
  for (let i = 0; i < students.length; i++) {
    if (students[i].rollNo === rollNo) {
      student = students[i];
      break;
    }
  }

  if (!student) return;

  let pct = getPercentage(student.attendedClasses, student.totalClasses);
  let risk = getRiskStatus(pct);

  document.getElementById("modalStudentName").textContent = `${student.name} (${student.rollNo})`;
  document.getElementById("modalStudentSummary").textContent = 
    `${student.course} • Semester ${student.semester} • Overall Attendance: ${student.attendedClasses}/${student.totalClasses} (${pct}%) • Status: ${risk.label}`;

  const historyList = document.getElementById("modalHistoryList");
  historyList.innerHTML = "";

  let logs = student.history || [];
  for (let i = 0; i < logs.length; i++) {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${logs[i].period}</td>
      <td>${logs[i].subject}</td>
      <td><strong>${logs[i].record}</strong></td>
    `;
    historyList.appendChild(row);
  }

  document.getElementById("historyModal").style.display = "flex";
}

function closeHistoryModal() {
  document.getElementById("historyModal").style.display = "none";
}

document.getElementById("btnCloseModalX").addEventListener("click", closeHistoryModal);
document.getElementById("btnCloseModalBtn").addEventListener("click", closeHistoryModal);

// ==========================================================================
// 9. FORM: Add or Update Student Record
// ==========================================================================
document.getElementById("attendanceEntryForm").addEventListener("submit", function(event) {
  event.preventDefault();

  let roll = document.getElementById("inputRoll").value.trim().toUpperCase();
  let name = document.getElementById("inputName").value.trim();
  let course = document.getElementById("inputCourse").value;
  let semester = document.getElementById("inputSemester").value;
  let total = parseInt(document.getElementById("inputTotal").value);
  let attended = parseInt(document.getElementById("inputAttended").value);

  if (attended > total) {
    alert("Attended classes cannot be more than total classes.");
    return;
  }

  let existingIndex = -1;
  for (let i = 0; i < students.length; i++) {
    if (students[i].rollNo === roll) {
      existingIndex = i;
      break;
    }
  }

  if (existingIndex >= 0) {
    students[existingIndex].name = name;
    students[existingIndex].course = course;
    students[existingIndex].semester = semester;
    students[existingIndex].totalClasses = total;
    students[existingIndex].attendedClasses = attended;
  } else {
    students.push({
      rollNo: roll,
      name: name,
      password: "1234",
      course: course,
      semester: semester,
      totalClasses: total,
      attendedClasses: attended,
      history: [
        { period: "Current Month", subject: "Core Attendance", record: `Attended ${attended} / ${total}` }
      ]
    });
  }

  updateDashboard();
  renderTable();
  updateAlerts();

  alert(`Attendance saved for ${name} (${roll})`);
  event.target.reset();
});

// Reset to initial sample data
document.getElementById("btnResetData").addEventListener("click", function() {
  students = JSON.parse(JSON.stringify(initialStudents));
  updateDashboard();
  renderTable();
  updateAlerts();
  alert("Sample data has been reset.");
});

// ==========================================================================
// 10. EXPORT: Download CSV Report (Teacher only)
// ==========================================================================
function exportCSV() {
  let csv = "Roll No,Student Name,Course,Semester,Total Classes,Attended Classes,Attendance %,Status\n";

  for (let i = 0; i < students.length; i++) {
    let s = students[i];
    let pct = getPercentage(s.attendedClasses, s.totalClasses);
    let risk = getRiskStatus(pct);
    csv += `"${s.rollNo}","${s.name}","${s.course}",${s.semester},${s.totalClasses},${s.attendedClasses},${pct}%,"${risk.label}"\n`;
  }

  let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  let url = URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "sams_attendance_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("btnExportCSV").addEventListener("click", exportCSV);

// Filter Event Listeners
document.getElementById("courseFilter").addEventListener("change", renderTable);
document.getElementById("semesterFilter").addEventListener("change", renderTable);
document.getElementById("riskFilter").addEventListener("change", renderTable);

// ==========================================================================
// 11. INITIALIZATION: On Page Load, show Login Screen
// ==========================================================================
window.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "teacher") {
    currentUser = { role: "teacher", displayName: "Faculty / Admin" };
    renderApp();
  } else if (view === "teacher-table") {
    currentUser = { role: "teacher", displayName: "Faculty / Admin" };
    renderApp();
    setTimeout(() => {
      document.querySelector(".attendance-table").scrollIntoView({ behavior: "instant", block: "center" });
    }, 100);
  } else if (view === "alerts") {
    currentUser = { role: "teacher", displayName: "Faculty / Admin" };
    renderApp();
    setTimeout(() => {
      document.querySelector(".alerts-box").scrollIntoView({ behavior: "instant", block: "center" });
    }, 100);
  } else if (view === "student") {
    currentUser = { role: "student", studentData: students[0] };
    renderApp();
  } else if (view === "history") {
    currentUser = { role: "teacher", displayName: "Faculty / Admin" };
    renderApp();
    openStudentHistory("CS-101");
  } else {
    renderApp(); // starts with currentUser = null, displaying login screen
  }
});
