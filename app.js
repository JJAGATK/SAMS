/**
 * Student Attendance Risk Predictor
 * Pure Basic JavaScript
 * 
 * Features implemented:
 * 1. Student login / admin login
 * 2. Attendance entry / import
 * 3. Attendance percentage calculation
 * 4. Risk indicators
 * 5. Filters by course / semester
 * 6. Student history
 * 7. Alerts
 * 8. Dashboard
 * 9. Report export
 */

// Initial student dataset
const defaultStudents = [
  {
    rollNo: "CS-101",
    name: "Aarav Patel",
    course: "Computer Science",
    semester: "5",
    totalClasses: 40,
    attendedClasses: 25, // 62.5% -> Needs Support
    history: [
      { date: "Oct 2026", subject: "Data Structures", status: "Present: 13/20" },
      { date: "Oct 2026", subject: "Database Systems", status: "Present: 12/20" }
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
      { date: "Oct 2026", subject: "Data Structures", status: "Present: 18/20" },
      { date: "Oct 2026", subject: "Database Systems", status: "Present: 18/20" }
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
      { date: "Oct 2026", subject: "Computer Networks", status: "Present: 17/25" },
      { date: "Oct 2026", subject: "Web Technologies", status: "Present: 17/25" }
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
      { date: "Oct 2026", subject: "Computer Networks", status: "Present: 23/25" },
      { date: "Oct 2026", subject: "Web Technologies", status: "Present: 22/25" }
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
      { date: "Oct 2026", subject: "Digital Signals", status: "Present: 15/22" },
      { date: "Oct 2026", subject: "VLSI Circuits", status: "Present: 16/23" }
    ]
  }
];

// Active in-memory student records
let students = JSON.parse(JSON.stringify(defaultStudents));

// ---------------------------------------------------------
// 1. Attendance Percentage & Risk Indicator Calculation
// ---------------------------------------------------------
function getAttendancePercentage(attended, total) {
  if (!total || total === 0) return 0;
  return Math.round((attended / total) * 1000) / 10; // e.g. 62.5
}

function getRiskIndicator(percentage) {
  // 75% is the standard college attendance threshold
  if (percentage < 75.0) {
    return {
      status: "Needs Support",
      className: "risk-danger"
    };
  } else {
    return {
      status: "Safe",
      className: "risk-safe"
    };
  }
}

// ---------------------------------------------------------
// 2. Dashboard: Summary Calculation
// ---------------------------------------------------------
function updateDashboard() {
  const totalStudents = students.length;
  let totalPercent = 0;
  let atRiskCount = 0;

  students.forEach(student => {
    const pct = getAttendancePercentage(student.attendedClasses, student.totalClasses);
    totalPercent += pct;
    if (pct < 75.0) {
      atRiskCount++;
    }
  });

  const avgAttendance = totalStudents > 0 ? (totalPercent / totalStudents).toFixed(1) : 0;

  document.getElementById("dashTotalStudents").textContent = totalStudents;
  document.getElementById("dashAvgAttendance").textContent = avgAttendance + "%";
  document.getElementById("dashAtRisk").textContent = atRiskCount;
}

// ---------------------------------------------------------
// 3. Render Attendance Records Table
// ---------------------------------------------------------
function renderTable() {
  const tableBody = document.getElementById("tableBody");
  const courseFilter = document.getElementById("filterCourse").value;
  const semesterFilter = document.getElementById("filterSemester").value;
  const riskFilter = document.getElementById("filterRisk").value;

  // Filter students based on dropdown selections
  const filtered = students.filter(student => {
    const pct = getAttendancePercentage(student.attendedClasses, student.totalClasses);
    const isAtRisk = pct < 75.0;

    const matchCourse = courseFilter === "ALL" || student.course === courseFilter;
    const matchSem = semesterFilter === "ALL" || student.semester === semesterFilter;
    const matchRisk = riskFilter === "ALL" || 
      (riskFilter === "RISK" && isAtRisk) || 
      (riskFilter === "SAFE" && !isAtRisk);

    return matchCourse && matchSem && matchRisk;
  });

  // Display count
  document.getElementById("recordCount").textContent = `Showing ${filtered.length} of ${students.length} students`;

  // Clear rows
  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #6b7280;">No records found.</td></tr>`;
    return;
  }

  // Populate rows
  filtered.forEach(student => {
    const pct = getAttendancePercentage(student.attendedClasses, student.totalClasses);
    const risk = getRiskIndicator(pct);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${student.rollNo}</strong></td>
      <td>${student.name}</td>
      <td>${student.course}</td>
      <td>Semester ${student.semester}</td>
      <td>${student.totalClasses}</td>
      <td>${student.attendedClasses}</td>
      <td><strong>${pct}%</strong></td>
      <td><span class="risk-badge ${risk.className}">${risk.status}</span></td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" onclick="showStudentHistory('${student.rollNo}')">
          View History
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ---------------------------------------------------------
// 4. Alerts: Highlight students who need academic support
// ---------------------------------------------------------
function updateAlerts() {
  const container = document.getElementById("alertsContainer");
  container.innerHTML = "";

  const atRiskStudents = students.filter(student => {
    const pct = getAttendancePercentage(student.attendedClasses, student.totalClasses);
    return pct < 75.0;
  });

  if (atRiskStudents.length === 0) {
    container.innerHTML = `<p style="color: #15803d; font-size: 13px;">All students currently meet the required 75% attendance threshold.</p>`;
    return;
  }

  atRiskStudents.forEach(student => {
    const pct = getAttendancePercentage(student.attendedClasses, student.totalClasses);
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert-item";
    alertDiv.innerHTML = `
      <div>
        <strong>${student.name} (${student.rollNo})</strong> &mdash; ${student.course}, Sem ${student.semester}
      </div>
      <div>
        Attendance: <strong>${pct}%</strong> (Needs Academic Support)
      </div>
    `;
    container.appendChild(alertDiv);
  });
}

// ---------------------------------------------------------
// 5. Student History Modal
// ---------------------------------------------------------
function showStudentHistory(rollNo) {
  const student = students.find(s => s.rollNo === rollNo);
  if (!student) return;

  const pct = getAttendancePercentage(student.attendedClasses, student.totalClasses);
  const risk = getRiskIndicator(pct);

  document.getElementById("modalStudentName").textContent = `${student.name} (${student.rollNo})`;
  document.getElementById("modalStudentDetails").textContent = 
    `${student.course} &bull; Semester ${student.semester} &bull; Total Attendance: ${student.attendedClasses}/${student.totalClasses} (${pct}%) &bull; Status: ${risk.status}`;

  const historyTbody = document.getElementById("modalHistoryBody");
  historyTbody.innerHTML = "";

  const logs = student.history && student.history.length > 0 ? student.history : [
    { date: "Current Term", subject: "Overall Attendance", status: `${student.attendedClasses}/${student.totalClasses} classes` }
  ];

  logs.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.subject}</td>
      <td>${item.status}</td>
    `;
    historyTbody.appendChild(row);
  });

  document.getElementById("historyModal").style.display = "flex";
}

// Close Modal
document.getElementById("btnCloseModal").addEventListener("click", () => {
  document.getElementById("historyModal").style.display = "none";
});

// ---------------------------------------------------------
// 6. Attendance Entry & Import
// ---------------------------------------------------------
document.getElementById("attendanceForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const roll = document.getElementById("inputRoll").value.trim().toUpperCase();
  const name = document.getElementById("inputName").value.trim();
  const course = document.getElementById("inputCourse").value;
  const semester = document.getElementById("inputSemester").value;
  const total = parseInt(document.getElementById("inputTotal").value);
  const attended = parseInt(document.getElementById("inputAttended").value);

  if (attended > total) {
    alert("Attended classes cannot be greater than total classes.");
    return;
  }

  // Check if student exists
  const existingIndex = students.findIndex(s => s.rollNo === roll);
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
      course: course,
      semester: semester,
      totalClasses: total,
      attendedClasses: attended,
      history: [
        { date: "Nov 2026", subject: "Regular Classes", status: `Present: ${attended}/${total}` }
      ]
    });
  }

  // Refresh
  updateDashboard();
  renderTable();
  updateAlerts();
  populateStudentDropdown();
  alert(`Attendance recorded for ${name} (${roll}).`);
  e.target.reset();
});

// Import Sample Records
document.getElementById("btnImportData").addEventListener("click", () => {
  students = JSON.parse(JSON.stringify(defaultStudents));
  updateDashboard();
  renderTable();
  updateAlerts();
  populateStudentDropdown();
  alert("Sample attendance records imported successfully.");
});

// ---------------------------------------------------------
// 7. Student Login vs Admin Login
// ---------------------------------------------------------
function setupAuthRoles() {
  const roleSelect = document.getElementById("userRole");
  const studentSection = document.getElementById("studentViewSection");
  const dashboardSection = document.getElementById("dashboardSection");
  const entrySection = document.getElementById("entrySection");
  const alertsSection = document.getElementById("alertsSection");

  roleSelect.addEventListener("change", (e) => {
    const role = e.target.value;

    if (role === "student") {
      // Show student personal view; hide admin entry and alerts
      studentSection.style.display = "block";
      dashboardSection.style.display = "none";
      entrySection.style.display = "none";
      alertsSection.style.display = "none";
      renderStudentPersonalView();
    } else {
      // Admin View
      studentSection.style.display = "none";
      dashboardSection.style.display = "grid";
      entrySection.style.display = "block";
      alertsSection.style.display = "block";
    }
  });

  document.getElementById("selectStudentAccount").addEventListener("change", renderStudentPersonalView);
}

function populateStudentDropdown() {
  const dropdown = document.getElementById("selectStudentAccount");
  dropdown.innerHTML = "";
  students.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.rollNo;
    opt.textContent = `${s.name} (${s.rollNo})`;
    dropdown.appendChild(opt);
  });
}

function renderStudentPersonalView() {
  const selectedRoll = document.getElementById("selectStudentAccount").value || (students[0] && students[0].rollNo);
  const student = students.find(s => s.rollNo === selectedRoll);
  if (!student) return;

  const pct = getAttendancePercentage(student.attendedClasses, student.totalClasses);
  const risk = getRiskIndicator(pct);

  const container = document.getElementById("studentPersonalCard");
  container.innerHTML = `
    <h4>Welcome, ${student.name} (${student.rollNo})</h4>
    <p>Course: <strong>${student.course}</strong> | Semester: <strong>${student.semester}</strong></p>
    <p>Total Classes: <strong>${student.totalClasses}</strong> | Attended: <strong>${student.attendedClasses}</strong></p>
    <p>Your Attendance Percentage: <strong>${pct}%</strong></p>
    <p>Status: <span class="risk-badge ${risk.className}">${risk.status}</span></p>
    ${pct < 75 ? '<p style="color: #b91c1c; margin-top: 6px;"><strong>Alert:</strong> Your attendance is below the required 75%. Please contact your course faculty for academic support.</p>' : '<p style="color: #15803d; margin-top: 6px;">Good job! Your attendance is in the safe zone.</p>'}
  `;
}

// ---------------------------------------------------------
// 8. Report Export (CSV)
// ---------------------------------------------------------
function exportReportCSV() {
  let csv = "Roll No,Student Name,Course,Semester,Total Classes,Attended Classes,Attendance %,Risk Indicator\n";

  students.forEach(s => {
    const pct = getAttendancePercentage(s.attendedClasses, s.totalClasses);
    const risk = getRiskIndicator(pct);
    csv += `"${s.rollNo}","${s.name}","${s.course}",${s.semester},${s.totalClasses},${s.attendedClasses},${pct}%,"${risk.status}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "student_attendance_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("btnExportReport").addEventListener("click", exportReportCSV);

// Filter Event Listeners
document.getElementById("filterCourse").addEventListener("change", renderTable);
document.getElementById("filterSemester").addEventListener("change", renderTable);
document.getElementById("filterRisk").addEventListener("change", renderTable);

// ---------------------------------------------------------
// Initialize on Page Load
// ---------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  populateStudentDropdown();
  updateDashboard();
  renderTable();
  updateAlerts();
  setupAuthRoles();
});
