/**
 * EduAlert - Student Attendance & Academic Support System
 * Pure Vanilla JavaScript (Basic, beginner-friendly code)
 */

// 1. Initial list of students
const sampleStudents = [
  {
    rollNo: "CS-101",
    name: "Aarav Patel",
    course: "Computer Science",
    semester: "5",
    totalClasses: 40,
    attendedClasses: 25, // 62.5% -> Needs Support
    history: [
      { period: "Month 1", subject: "Data Structures", record: "Attended: 13 / 20 classes" },
      { period: "Month 2", subject: "Database Systems", record: "Attended: 12 / 20 classes" }
    ]
  },
  {
    rollNo: "CS-102",
    name: "Rohan Verma",
    course: "Computer Science",
    semester: "5",
    totalClasses: 40,
    attendedClasses: 36, // 90.0% -> Safe
    history: [
      { period: "Month 1", subject: "Data Structures", record: "Attended: 18 / 20 classes" },
      { period: "Month 2", subject: "Database Systems", record: "Attended: 18 / 20 classes" }
    ]
  },
  {
    rollNo: "IT-201",
    name: "Sneha Mukherjee",
    course: "Information Technology",
    semester: "3",
    totalClasses: 50,
    attendedClasses: 34, // 68.0% -> Needs Support
    history: [
      { period: "Month 1", subject: "Computer Networks", record: "Attended: 17 / 25 classes" },
      { period: "Month 2", subject: "Web Technologies", record: "Attended: 17 / 25 classes" }
    ]
  },
  {
    rollNo: "IT-202",
    name: "Vikram Malhotra",
    course: "Information Technology",
    semester: "3",
    totalClasses: 50,
    attendedClasses: 45, // 90.0% -> Safe
    history: [
      { period: "Month 1", subject: "Computer Networks", record: "Attended: 23 / 25 classes" },
      { period: "Month 2", subject: "Web Technologies", record: "Attended: 22 / 25 classes" }
    ]
  },
  {
    rollNo: "EC-301",
    name: "Ananya Iyer",
    course: "Electronics",
    semester: "5",
    totalClasses: 45,
    attendedClasses: 31, // 68.9% -> Needs Support
    history: [
      { period: "Month 1", subject: "Digital Electronics", record: "Attended: 15 / 22 classes" },
      { period: "Month 2", subject: "VLSI Circuits", record: "Attended: 16 / 23 classes" }
    ]
  }
];

// Active list in memory
let studentsList = JSON.parse(JSON.stringify(sampleStudents));

// --------------------------------------------------------------------------
// Helper 1: Calculate Attendance Percentage
// Formula: (Classes Attended / Total Classes) * 100
// --------------------------------------------------------------------------
function calculateAttendancePercentage(attended, total) {
  if (!total || total === 0) return 0;
  const percentage = (attended / total) * 100;
  return Math.round(percentage * 10) / 10; // Round to 1 decimal place (e.g. 62.5)
}

// --------------------------------------------------------------------------
// Helper 2: Determine Risk Indicator
// College rule: Below 75% requires academic support
// --------------------------------------------------------------------------
function getRiskIndicator(percentage) {
  if (percentage < 75.0) {
    return {
      status: "Needs Support",
      badgeClass: "badge-danger",
      isRisk: true
    };
  } else {
    return {
      status: "Safe",
      badgeClass: "badge-safe",
      isRisk: false
    };
  }
}

// --------------------------------------------------------------------------
// 2. Update Dashboard Summary Cards
// --------------------------------------------------------------------------
function updateDashboard() {
  const totalCount = studentsList.length;
  let totalPercentSum = 0;
  let atRiskCount = 0;

  studentsList.forEach((student) => {
    const pct = calculateAttendancePercentage(student.attendedClasses, student.totalClasses);
    totalPercentSum += pct;
    if (pct < 75.0) {
      atRiskCount++;
    }
  });

  const averagePct = totalCount > 0 ? (totalPercentSum / totalCount).toFixed(1) : 0;

  document.getElementById("dashTotalStudents").textContent = totalCount;
  document.getElementById("dashAvgAttendance").textContent = averagePct + "%";
  document.getElementById("dashAtRisk").textContent = atRiskCount;
}

// --------------------------------------------------------------------------
// 3. Render Attendance Records Table (with Filters)
// --------------------------------------------------------------------------
function renderAttendanceTable() {
  const tableBody = document.getElementById("tableBody");
  const selectedCourse = document.getElementById("filterCourse").value;
  const selectedSemester = document.getElementById("filterSemester").value;
  const selectedRisk = document.getElementById("filterRisk").value;

  // Filter the array
  const filtered = studentsList.filter((student) => {
    const pct = calculateAttendancePercentage(student.attendedClasses, student.totalClasses);
    const isAtRisk = pct < 75.0;

    const matchesCourse = selectedCourse === "ALL" || student.course === selectedCourse;
    const matchesSemester = selectedSemester === "ALL" || student.semester === selectedSemester;
    const matchesRisk =
      selectedRisk === "ALL" ||
      (selectedRisk === "RISK" && isAtRisk) ||
      (selectedRisk === "SAFE" && !isAtRisk);

    return matchesCourse && matchesSemester && matchesRisk;
  });

  // Update record count text
  document.getElementById("recordCount").textContent = `Showing ${filtered.length} of ${studentsList.length} students`;

  // Clear existing rows
  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 24px; color: #64748b;">
          No matching student records found.
        </td>
      </tr>
    `;
    return;
  }

  // Insert rows
  filtered.forEach((student) => {
    const pct = calculateAttendancePercentage(student.attendedClasses, student.totalClasses);
    const risk = getRiskIndicator(pct);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${student.rollNo}</strong></td>
      <td>${student.name}</td>
      <td>${student.course}</td>
      <td>Semester ${student.semester}</td>
      <td class="text-center">${student.totalClasses}</td>
      <td class="text-center"><strong>${student.attendedClasses}</strong></td>
      <td class="text-center"><strong>${pct}%</strong></td>
      <td>
        <span class="risk-badge ${risk.badgeClass}">${risk.status}</span>
      </td>
      <td class="text-center">
        <button type="button" class="btn btn-outline btn-sm" onclick="openStudentHistory('${student.rollNo}')">
          View History
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// --------------------------------------------------------------------------
// 4. Update Alerts Section
// --------------------------------------------------------------------------
function updateAlertsList() {
  const container = document.getElementById("alertsContainer");
  container.innerHTML = "";

  const studentsAtRisk = studentsList.filter((student) => {
    const pct = calculateAttendancePercentage(student.attendedClasses, student.totalClasses);
    return pct < 75.0;
  });

  if (studentsAtRisk.length === 0) {
    container.innerHTML = `
      <p style="color: #15803d; font-size: 13px; padding: 8px 0;">
        All students currently meet the required 75% attendance threshold.
      </p>
    `;
    return;
  }

  studentsAtRisk.forEach((student) => {
    const pct = calculateAttendancePercentage(student.attendedClasses, student.totalClasses);
    const row = document.createElement("div");
    row.className = "alert-row";
    row.innerHTML = `
      <div class="alert-info">
        <strong>${student.name} (${student.rollNo})</strong>
        <div class="alert-meta">${student.course} &bull; Semester ${student.semester}</div>
      </div>
      <div class="alert-stat">
        Attendance: ${pct}% (Needs Support)
      </div>
    `;
    container.appendChild(row);
  });
}

// --------------------------------------------------------------------------
// 5. Student History Modal
// --------------------------------------------------------------------------
function openStudentHistory(rollNo) {
  const student = studentsList.find((s) => s.rollNo === rollNo);
  if (!student) return;

  const pct = calculateAttendancePercentage(student.attendedClasses, student.totalClasses);
  const risk = getRiskIndicator(pct);

  document.getElementById("modalStudentName").textContent = `${student.name} (${student.rollNo})`;
  document.getElementById("modalStudentDetails").textContent =
    `${student.course} • Semester ${student.semester} • Total Attendance: ${student.attendedClasses}/${student.totalClasses} (${pct}%) • Status: ${risk.status}`;

  const historyBody = document.getElementById("modalHistoryBody");
  historyBody.innerHTML = "";

  const historyLogs = student.history && student.history.length > 0 ? student.history : [
    { period: "Current Semester", subject: "Overall Attendance", record: `Attended ${student.attendedClasses} of ${student.totalClasses} classes` }
  ];

  historyLogs.forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.period}</td>
      <td>${log.subject}</td>
      <td><strong>${log.record}</strong></td>
    `;
    historyBody.appendChild(row);
  });

  document.getElementById("historyModal").style.display = "flex";
}

// Close Modal helper
function closeModal() {
  document.getElementById("historyModal").style.display = "none";
}

document.getElementById("btnCloseModal").addEventListener("click", closeModal);
document.getElementById("btnCloseModalBtn").addEventListener("click", closeModal);

// --------------------------------------------------------------------------
// 6. Form: Add or Update Student Attendance
// --------------------------------------------------------------------------
document.getElementById("attendanceForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const roll = document.getElementById("inputRoll").value.trim().toUpperCase();
  const name = document.getElementById("inputName").value.trim();
  const course = document.getElementById("inputCourse").value;
  const semester = document.getElementById("inputSemester").value;
  const total = parseInt(document.getElementById("inputTotal").value);
  const attended = parseInt(document.getElementById("inputAttended").value);

  // Validation
  if (attended > total) {
    alert("Classes attended cannot be greater than total classes conducted.");
    return;
  }

  // Check if roll number already exists; if so, update
  const existingIndex = studentsList.findIndex((s) => s.rollNo === roll);
  if (existingIndex >= 0) {
    studentsList[existingIndex].name = name;
    studentsList[existingIndex].course = course;
    studentsList[existingIndex].semester = semester;
    studentsList[existingIndex].totalClasses = total;
    studentsList[existingIndex].attendedClasses = attended;
  } else {
    // Add new student
    studentsList.push({
      rollNo: roll,
      name: name,
      course: course,
      semester: semester,
      totalClasses: total,
      attendedClasses: attended,
      history: [
        { period: "Current Semester", subject: "General Attendance", record: `Attended: ${attended} / ${total} classes` }
      ]
    });
  }

  // Refresh all parts of the UI
  updateDashboard();
  renderAttendanceTable();
  updateAlertsList();
  populateStudentDropdown();

  alert(`Attendance successfully saved for ${name} (${roll}).`);
  e.target.reset();
});

// Import / Reset Sample Data
document.getElementById("btnImportData").addEventListener("click", () => {
  studentsList = JSON.parse(JSON.stringify(sampleStudents));
  updateDashboard();
  renderAttendanceTable();
  updateAlertsList();
  populateStudentDropdown();
  alert("Sample student records have been reset.");
});

// --------------------------------------------------------------------------
// 7. Role Switching: Admin vs Student Portal
// --------------------------------------------------------------------------
function setupRoleSwitching() {
  const roleSelect = document.getElementById("userRole");
  const studentSection = document.getElementById("studentPortalSection");
  const dashboardSection = document.getElementById("dashboardSection");
  const entrySection = document.getElementById("entrySection");
  const alertsSection = document.getElementById("alertsSection");

  roleSelect.addEventListener("change", (e) => {
    const role = e.target.value;

    if (role === "student") {
      // Show student personal portal view; hide admin controls
      studentSection.style.display = "block";
      dashboardSection.style.display = "none";
      entrySection.style.display = "none";
      alertsSection.style.display = "none";
      renderStudentPersonalView();
    } else {
      // Show admin controls
      studentSection.style.display = "none";
      dashboardSection.style.display = "grid";
      entrySection.style.display = "block";
      alertsSection.style.display = "block";
    }
  });

  document.getElementById("selectStudentAccount").addEventListener("change", renderStudentPersonalView);
}

function populateStudentDropdown() {
  const select = document.getElementById("selectStudentAccount");
  select.innerHTML = "";

  studentsList.forEach((student) => {
    const opt = document.createElement("option");
    opt.value = student.rollNo;
    opt.textContent = `${student.name} (${student.rollNo})`;
    select.appendChild(opt);
  });
}

function renderStudentPersonalView() {
  const selectedRoll = document.getElementById("selectStudentAccount").value || (studentsList[0] && studentsList[0].rollNo);
  const student = studentsList.find((s) => s.rollNo === selectedRoll);
  if (!student) return;

  const pct = calculateAttendancePercentage(student.attendedClasses, student.totalClasses);
  const risk = getRiskIndicator(pct);

  const container = document.getElementById("studentPersonalCard");
  container.innerHTML = `
    <h3>Welcome, ${student.name}</h3>
    <p>Roll Number: <strong>${student.rollNo}</strong> &bull; Course: <strong>${student.course}</strong> &bull; Semester: <strong>${student.semester}</strong></p>
    <p>Classes Conducted: <strong>${student.totalClasses}</strong> &bull; Classes Attended: <strong>${student.attendedClasses}</strong></p>
    <p>Your Current Attendance: <strong style="font-size: 15px;">${pct}%</strong></p>
    <p>Eligibility Status: <span class="risk-badge ${risk.badgeClass}">${risk.status}</span></p>
    <div class="student-alert-note ${risk.isRisk ? 'note-danger' : 'note-safe'}">
      ${
        risk.isRisk
          ? `<strong>Notice:</strong> Your attendance is below the mandatory 75% requirement. Please meet your faculty advisor for academic support.`
          : `<strong>Great job!</strong> Your attendance meets the college examination requirement.`
      }
    </div>
  `;
}

// --------------------------------------------------------------------------
// 8. Report Export (CSV File Download)
// --------------------------------------------------------------------------
function exportReportToCSV() {
  let csvContent = "Roll Number,Student Name,Course,Semester,Total Classes,Classes Attended,Attendance %,Status\n";

  studentsList.forEach((s) => {
    const pct = calculateAttendancePercentage(s.attendedClasses, s.totalClasses);
    const risk = getRiskIndicator(pct);
    csvContent += `"${s.rollNo}","${s.name}","${s.course}",${s.semester},${s.totalClasses},${s.attendedClasses},${pct}%,"${risk.status}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", downloadUrl);
  link.setAttribute("download", "edualert_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("btnExportReport").addEventListener("click", exportReportToCSV);

// Filter Event Listeners
document.getElementById("filterCourse").addEventListener("change", renderAttendanceTable);
document.getElementById("filterSemester").addEventListener("change", renderAttendanceTable);
document.getElementById("filterRisk").addEventListener("change", renderAttendanceTable);

// --------------------------------------------------------------------------
// 9. Startup Initialization
// --------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  populateStudentDropdown();
  updateDashboard();
  renderAttendanceTable();
  updateAlertsList();
  setupRoleSwitching();
});
