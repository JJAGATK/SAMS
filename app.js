// SAMS - Student Attendance Monitoring System
const teacherAccount = { username: "admin", password: "admin123", displayName: "Faculty / Admin" };

const initialStudents = [
  ["CS-101", "Aarav Patel", "Computer Science", "5", 40, 25, ["Data Structures", "13 / 20"], ["Database Systems", "12 / 20"]],
  ["CS-102", "Rohan Verma", "Computer Science", "5", 40, 36, ["Data Structures", "18 / 20"], ["Database Systems", "18 / 20"]],
  ["IT-201", "Sneha Mukherjee", "Information Technology", "3", 50, 34, ["Computer Networks", "17 / 25"], ["Web Technologies", "17 / 25"]],
  ["IT-202", "Vikram Malhotra", "Information Technology", "3", 50, 45, ["Computer Networks", "23 / 25"], ["Web Technologies", "22 / 25"]],
  ["EC-301", "Ananya Iyer", "Electronics", "5", 45, 31, ["Digital Electronics", "15 / 22"], ["VLSI Circuits", "16 / 23"]]
].map(([rollNo, name, course, semester, totalClasses, attendedClasses, h1, h2]) => ({
  rollNo, name, password: "1234", course, semester, totalClasses, attendedClasses,
  history: [
    { period: "Month 1", subject: h1[0], record: `Attended ${h1[1]}` },
    { period: "Month 2", subject: h2[0], record: `Attended ${h2[1]}` }
  ]
}));

let students = JSON.parse(JSON.stringify(initialStudents));
let currentUser = null;
const $ = (id) => document.getElementById(id);

const getPercentage = (a, t) => (t > 0 ? (a / t) * 100 : 0).toFixed(1);
const getRiskStatus = (pct) => {
  const isAtRisk = Number(pct) < 75;
  return { label: isAtRisk ? "Needs Support" : "Safe", badgeClass: isAtRisk ? "badge-danger" : "badge-safe", isAtRisk };
};
const getClassesNeededFor75 = (a, t) => Math.max(0, Math.ceil((0.75 * t - a) / 0.25));

$("formLogin").onsubmit = (e) => {
  e.preventDefault();
  const idInput = $("loginIdentifier").value.trim();
  const pwdInput = $("loginPassword").value.trim();

  // If Admin / Teacher username entered
  if (idInput.toLowerCase() === teacherAccount.username.toLowerCase()) {
    if (pwdInput === teacherAccount.password) {
      currentUser = { role: "teacher", displayName: teacherAccount.displayName };
      renderApp();
      return;
    } else {
      alert("Invalid password for Admin. Default is: admin123");
      return;
    }
  }

  // Otherwise check if Student Roll Number entered
  const student = students.find((s) => s.rollNo.toUpperCase() === idInput.toUpperCase());
  if (student) {
    if (pwdInput === student.password) {
      currentUser = { role: "student", studentData: student };
      renderApp();
      return;
    } else {
      alert(`Invalid password for student ${student.rollNo}. Default is: 1234`);
      return;
    }
  }

  alert("Account not found. For Teacher/Admin login use 'admin' (password: admin123). For Student login use roll number like 'CS-101' (password: 1234).");
};

$("btnLogout").onclick = () => { currentUser = null; renderApp(); };

function renderApp() {
  const isLogged = !!currentUser;
  $("loginScreen").style.display = isLogged ? "none" : "flex";
  $("mainAppContent").style.display = isLogged ? "block" : "none";
  $("navUserBox").style.display = isLogged ? "flex" : "none";
  if (!isLogged) return;

  const isTeacher = currentUser.role === "teacher";
  $("navUserName").textContent = isTeacher ? "Teacher: Admin" : `Student: ${currentUser.studentData.name}`;
  $("teacherDashboardView").style.display = isTeacher ? "block" : "none";
  $("studentPersonalView").style.display = isTeacher ? "none" : "block";

  isTeacher ? refreshTeacherViews() : renderStudentPersonalDashboard(currentUser.studentData);
}

function renderStudentPersonalDashboard(s) {
  const pct = getPercentage(s.attendedClasses, s.totalClasses);
  const risk = getRiskStatus(pct);

  $("stuGreetingName").textContent = `Welcome, ${s.name}`;
  $("stuMetaDetails").textContent = `${s.course} • Semester ${s.semester} • Roll No: ${s.rollNo}`;
  $("stuRiskBadgeContainer").innerHTML = `<span class="badge ${risk.badgeClass}" style="font-size:13px;padding:6px 12px;">${risk.label}</span>`;
  $("stuTotalHeld").textContent = s.totalClasses;
  $("stuTotalAttended").textContent = s.attendedClasses;
  $("stuTotalMissed").textContent = s.totalClasses - s.attendedClasses;
  $("stuPercentage").textContent = `${pct}%`;

  $("stuNoticeBanner").className = `student-notice-card ${risk.isAtRisk ? "notice-danger" : "notice-safe"}`;
  $("stuNoticeBanner").innerHTML = risk.isAtRisk
    ? `<strong>Academic Support Notice:</strong> Your attendance is currently <strong>${pct}%</strong>, which is below the mandatory 75% college requirement.<br>To get back into the safe zone, you must attend the next <strong>${getClassesNeededFor75(s.attendedClasses, s.totalClasses)} consecutive classes</strong> without being absent. Please meet your faculty advisor for guidance.`
    : `<strong>Good Standing:</strong> Your attendance is <strong>${pct}%</strong> and meets the college examination eligibility requirement. Keep it up!`;

  $("stuSubjectTableBody").innerHTML = s.history?.length
    ? s.history.map((l) => `<tr><td>${l.period}</td><td><strong>${l.subject}</strong></td><td>${l.record}</td></tr>`).join("")
    : `<tr><td colspan="3" style="text-align:center;padding:12px;color:#64748b;">No subject history recorded yet.</td></tr>`;
}

function updateDashboard() {
  const total = students.length;
  const atRisk = students.filter((s) => Number(getPercentage(s.attendedClasses, s.totalClasses)) < 75).length;
  const avg = total ? (students.reduce((sum, s) => sum + Number(getPercentage(s.attendedClasses, s.totalClasses)), 0) / total).toFixed(1) : "0.0";
  $("totalStudentsCount").textContent = total;
  $("averageAttendancePercent").textContent = `${avg}%`;
  $("atRiskStudentsCount").textContent = atRisk;
}

function renderTable() {
  const [course, sem, risk] = [$("courseFilter").value, $("semesterFilter").value, $("riskFilter").value];
  const filtered = students.filter((s) => {
    const isRisk = Number(getPercentage(s.attendedClasses, s.totalClasses)) < 75;
    return (course === "ALL" || s.course === course) &&
           (sem === "ALL" || s.semester === sem) &&
           (risk === "ALL" || (risk === "RISK" ? isRisk : !isRisk));
  });

  $("tableRecordCount").textContent = `Showing ${filtered.length} of ${students.length} students`;
  $("attendanceTableBody").innerHTML = filtered.length
    ? filtered.map((s) => {
        const pct = getPercentage(s.attendedClasses, s.totalClasses);
        const { label, badgeClass } = getRiskStatus(pct);
        return `<tr>
          <td><strong>${s.rollNo}</strong></td><td>${s.name}</td><td>${s.course}</td><td>Semester ${s.semester}</td>
          <td class="text-center">${s.totalClasses}</td><td class="text-center"><strong>${s.attendedClasses}</strong></td>
          <td class="text-center"><strong>${pct}%</strong></td><td><span class="badge ${badgeClass}">${label}</span></td>
          <td class="text-center"><button type="button" class="btn btn-outline btn-sm" onclick="openStudentHistory('${s.rollNo}')">View History</button></td>
        </tr>`;
      }).join("")
    : `<tr><td colspan="9" style="text-align:center;padding:16px;color:#64748b;">No matching records found.</td></tr>`;
}

function updateAlerts() {
  const atRisk = students.filter((s) => Number(getPercentage(s.attendedClasses, s.totalClasses)) < 75);
  $("alertsContainer").innerHTML = atRisk.length
    ? atRisk.map((s) => `
        <div class="alert-card">
          <div><strong>${s.name} (${s.rollNo})</strong> &mdash; ${s.course}, Semester ${s.semester}</div>
          <div>Attendance: <strong>${getPercentage(s.attendedClasses, s.totalClasses)}%</strong> (Needs Academic Support)</div>
        </div>`).join("")
    : `<p style="color:#15803d;font-size:13px;">All students meet the 75% attendance requirement.</p>`;
}

const refreshTeacherViews = () => { updateDashboard(); renderTable(); updateAlerts(); };

window.openStudentHistory = (rollNo) => {
  const s = students.find((item) => item.rollNo === rollNo);
  if (!s) return;
  const pct = getPercentage(s.attendedClasses, s.totalClasses);
  $("modalStudentName").textContent = `${s.name} (${s.rollNo})`;
  $("modalStudentSummary").textContent = `${s.course} • Semester ${s.semester} • Overall Attendance: ${s.attendedClasses}/${s.totalClasses} (${pct}%) • Status: ${getRiskStatus(pct).label}`;
  $("modalHistoryList").innerHTML = (s.history || []).map((l) => `<tr><td>${l.period}</td><td>${l.subject}</td><td><strong>${l.record}</strong></td></tr>`).join("");
  $("historyModal").style.display = "flex";
};

const closeModal = () => { $("historyModal").style.display = "none"; };
$("btnCloseModalX").onclick = $("btnCloseModalBtn").onclick = closeModal;

$("attendanceEntryForm").onsubmit = (e) => {
  e.preventDefault();
  const [roll, name, course, semester, total, attended] = [
    $("inputRoll").value.trim().toUpperCase(),
    $("inputName").value.trim(),
    $("inputCourse").value,
    $("inputSemester").value,
    +$("inputTotal").value,
    +$("inputAttended").value
  ];

  if (attended > total) return alert("Attended classes cannot be more than total classes.");

  const existing = students.find((s) => s.rollNo === roll);
  if (existing) {
    Object.assign(existing, { name, course, semester, totalClasses: total, attendedClasses: attended });
  } else {
    students.push({
      rollNo: roll, name, password: "1234", course, semester, totalClasses: total, attendedClasses: attended,
      history: [{ period: "Current Month", subject: "Core Attendance", record: `Attended ${attended} / ${total}` }]
    });
  }
  refreshTeacherViews();
  alert(`Attendance saved for ${name} (${roll})`);
  e.target.reset();
};

$("btnResetData").onclick = () => {
  students = JSON.parse(JSON.stringify(initialStudents));
  refreshTeacherViews();
  alert("Sample data has been reset.");
};

$("btnExportCSV").onclick = () => {
  const rows = students.map((s) => {
    const pct = getPercentage(s.attendedClasses, s.totalClasses);
    return `"${s.rollNo}","${s.name}","${s.course}",${s.semester},${s.totalClasses},${s.attendedClasses},${pct}%,"${getRiskStatus(pct).label}"`;
  });
  const csv = ["Roll No,Student Name,Course,Semester,Total Classes,Attended Classes,Attendance %,Status", ...rows].join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })),
    download: "sams_attendance_report.csv"
  });
  a.click();
  URL.revokeObjectURL(a.href);
};

["courseFilter", "semesterFilter", "riskFilter"].forEach((id) => ($(id).onchange = renderTable));

window.addEventListener("DOMContentLoaded", () => {
  const view = new URLSearchParams(window.location.search).get("view");
  if (view === "student") currentUser = { role: "student", studentData: students[0] };
  else if (view) currentUser = { role: "teacher", displayName: teacherAccount.displayName };
  renderApp();

  if (view === "history") window.openStudentHistory("CS-101");
  const target = view === "teacher-table" ? ".attendance-table" : view === "alerts" ? ".alerts-box" : null;
  if (target) setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: "instant", block: "center" }), 100);
});
