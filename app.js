/**
 * SAMS - Student Attendance Monitoring System
 * Simple, Clean Vanilla JavaScript
 * 
 * Written in plain, beginner-friendly JavaScript so anyone can easily read 
 * and explain it in viva / project presentations.
 */

// ==========================================================================
// 1. DATA: List of sample students
// ==========================================================================
const initialStudents = [
  {
    rollNo: "CS-101",
    name: "Aarav Patel",
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

// ==========================================================================
// 2. MATH HELPERS: Percentage and Risk Status
// ==========================================================================

// Calculates: (Attended / Total) * 100
function getPercentage(attended, total) {
  if (total <= 0) return 0;
  let percent = (attended / total) * 100;
  return percent.toFixed(1); // e.g. "62.5"
}

// Checks if student is in Safe Zone (>= 75%) or Needs Academic Support (< 75%)
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

// ==========================================================================
// 3. DASHBOARD: Calculate summary statistics
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

  // Update numbers on the screen
  document.getElementById("totalStudentsCount").textContent = totalStudents;
  document.getElementById("averageAttendancePercent").textContent = average + "%";
  document.getElementById("atRiskStudentsCount").textContent = atRiskCount;
}

// ==========================================================================
// 4. TABLE: Render student attendance rows with filters
// ==========================================================================
function renderTable() {
  const tableBody = document.getElementById("attendanceTableBody");
  const selectedCourse = document.getElementById("courseFilter").value;
  const selectedSemester = document.getElementById("semesterFilter").value;
  const selectedRisk = document.getElementById("riskFilter").value;

  // Filter students array based on dropdown choices
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

  // Update record count text
  document.getElementById("tableRecordCount").textContent = `Showing ${filtered.length} of ${students.length} students`;

  // Clear existing table rows
  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:16px; color:#64748b;">No matching records found.</td></tr>`;
    return;
  }

  // Add each student as a table row
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
// 5. ALERTS: Show students who have low attendance (< 75%)
// ==========================================================================
function updateAlerts() {
  const container = document.getElementById("alertsContainer");
  container.innerHTML = "";

  let count = 0;

  for (let i = 0; i < students.length; i++) {
    let s = students[i];
    let pct = parseFloat(getPercentage(s.attendedClasses, s.totalClasses));

    // Only show students whose attendance is below 75%
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
// 6. HISTORY POPUP: Show student's past attendance
// ==========================================================================
function openStudentHistory(rollNo) {
  // Find the student by roll number
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

  // Show the modal
  document.getElementById("historyModal").style.display = "flex";
}

// Close popup
function closeHistoryModal() {
  document.getElementById("historyModal").style.display = "none";
}

document.getElementById("btnCloseModalX").addEventListener("click", closeHistoryModal);
document.getElementById("btnCloseModalBtn").addEventListener("click", closeHistoryModal);

// ==========================================================================
// 7. FORM: Add or update attendance
// ==========================================================================
document.getElementById("attendanceEntryForm").addEventListener("submit", function(event) {
  event.preventDefault();

  let roll = document.getElementById("inputRoll").value.trim().toUpperCase();
  let name = document.getElementById("inputName").value.trim();
  let course = document.getElementById("inputCourse").value;
  let semester = document.getElementById("inputSemester").value;
  let total = parseInt(document.getElementById("inputTotal").value);
  let attended = parseInt(document.getElementById("inputAttended").value);

  // Simple validation
  if (attended > total) {
    alert("Attended classes cannot be more than total classes.");
    return;
  }

  // Check if roll number already exists
  let existingIndex = -1;
  for (let i = 0; i < students.length; i++) {
    if (students[i].rollNo === roll) {
      existingIndex = i;
      break;
    }
  }

  if (existingIndex >= 0) {
    // Update existing student
    students[existingIndex].name = name;
    students[existingIndex].course = course;
    students[existingIndex].semester = semester;
    students[existingIndex].totalClasses = total;
    students[existingIndex].attendedClasses = attended;
  } else {
    // Add new student
    students.push({
      rollNo: roll,
      name: name,
      course: course,
      semester: semester,
      totalClasses: total,
      attendedClasses: attended,
      history: [
        { period: "Current Month", subject: "Core Attendance", record: `Attended ${attended} / ${total}` }
      ]
    });
  }

  // Refresh UI
  updateDashboard();
  renderTable();
  updateAlerts();
  populateStudentDropdown();

  alert(`Attendance saved for ${name} (${roll})`);
  event.target.reset();
});

// Reset to initial sample data
document.getElementById("btnResetData").addEventListener("click", function() {
  students = JSON.parse(JSON.stringify(initialStudents));
  updateDashboard();
  renderTable();
  updateAlerts();
  populateStudentDropdown();
  alert("Sample data has been reset.");
});

// ==========================================================================
// 8. ROLE SWITCHING: Admin vs Student Portal
// ==========================================================================
function setupRoles() {
  const roleSelect = document.getElementById("roleSelect");
  const studentPortal = document.getElementById("studentPortal");
  const dashboardSection = document.getElementById("dashboardSection");
  const entrySection = document.getElementById("entrySection");
  const alertsSection = document.getElementById("alertsSection");

  roleSelect.addEventListener("change", function(e) {
    let role = e.target.value;

    if (role === "student") {
      // Student view: show personal portal card, hide admin forms
      studentPortal.style.display = "block";
      dashboardSection.style.display = "none";
      entrySection.style.display = "none";
      alertsSection.style.display = "none";
      showStudentPersonalCard();
    } else {
      // Admin view: show full dashboard and controls
      studentPortal.style.display = "none";
      dashboardSection.style.display = "grid";
      entrySection.style.display = "block";
      alertsSection.style.display = "block";
    }
  });

  document.getElementById("studentDropdown").addEventListener("change", showStudentPersonalCard);
}

// Fill student dropdown
function populateStudentDropdown() {
  const dropdown = document.getElementById("studentDropdown");
  dropdown.innerHTML = "";

  for (let i = 0; i < students.length; i++) {
    let opt = document.createElement("option");
    opt.value = students[i].rollNo;
    opt.textContent = `${students[i].name} (${students[i].rollNo})`;
    dropdown.appendChild(opt);
  }
}

// Display personal student details in the student portal
function showStudentPersonalCard() {
  let selectedRoll = document.getElementById("studentDropdown").value || (students[0] && students[0].rollNo);
  let student = null;

  for (let i = 0; i < students.length; i++) {
    if (students[i].rollNo === selectedRoll) {
      student = students[i];
      break;
    }
  }

  if (!student) return;

  let pct = getPercentage(student.attendedClasses, student.totalClasses);
  let risk = getRiskStatus(pct);

  const container = document.getElementById("studentPersonalDetails");
  container.innerHTML = `
    <h3>${student.name} (${student.rollNo})</h3>
    <p>Course: <strong>${student.course}</strong> &bull; Semester: <strong>${student.semester}</strong></p>
    <p>Classes Conducted: <strong>${student.totalClasses}</strong> | Attended: <strong>${student.attendedClasses}</strong></p>
    <p>Your Attendance: <strong>${pct}%</strong> &mdash; Status: <span class="badge ${risk.badgeClass}">${risk.label}</span></p>
    <div class="student-note ${risk.isAtRisk ? 'note-danger' : 'note-safe'}">
      ${risk.isAtRisk 
        ? "Warning: Your attendance is below 75%. Please contact your faculty for academic support."
        : "Good: Your attendance is above the 75% requirement."}
    </div>
  `;
}

// ==========================================================================
// 9. EXPORT: Download CSV Report
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

// Listen to filter dropdown changes
document.getElementById("courseFilter").addEventListener("change", renderTable);
document.getElementById("semesterFilter").addEventListener("change", renderTable);
document.getElementById("riskFilter").addEventListener("change", renderTable);

// ==========================================================================
// 10. INITIALIZATION: Run when page loads
// ==========================================================================
window.addEventListener("DOMContentLoaded", function() {
  populateStudentDropdown();
  updateDashboard();
  renderTable();
  updateAlerts();
  setupRoles();
});
