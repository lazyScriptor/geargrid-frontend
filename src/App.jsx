import React, { useState } from "react";

// ==========================================
// CENTRALIZED INLINE STYLES (Modern & Beautiful)
// ==========================================
const theme = {
  primary: "#0ea5e9",
  primaryDark: "#0284c7",
  bgLight: "#f8fafc",
  textMain: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
  white: "#ffffff",
};

const styles = {
  container: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    color: theme.textMain,
  },

  // Login
  loginWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  },
  loginCard: {
    backgroundColor: theme.white,
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid rgba(255,255,255,0.5)",
  },
  loginTitle: {
    textAlign: "center",
    color: "#0f172a",
    margin: "0 0 5px 0",
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },
  loginSub: {
    textAlign: "center",
    color: theme.textMuted,
    margin: "0 0 30px 0",
    fontSize: "15px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: `1px solid ${theme.border}`,
    borderRadius: "10px",
    boxSizing: "border-box",
    outline: "none",
    marginBottom: "20px",
    backgroundColor: "#f8fafc",
    transition: "border 0.2s",
  },
  btnPrimary: {
    width: "100%",
    backgroundColor: theme.primary,
    color: theme.white,
    border: "none",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
    boxShadow: "0 4px 6px rgba(14, 165, 233, 0.2)",
  },

  // Dashboard Layout
  navbar: {
    backgroundColor: theme.white,
    padding: "16px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${theme.border}`,
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  navTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: theme.textMain,
  },
  navSub: {
    margin: 0,
    fontSize: "13px",
    color: theme.primary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  btnLogout: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  mainLayout: {
    display: "flex",
    maxWidth: "1300px",
    margin: "30px auto",
    gap: "24px",
    padding: "0 20px",
    alignItems: "flex-start",
  },
  sidebar: {
    width: "280px",
    backgroundColor: theme.white,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    border: `1px solid ${theme.border}`,
    position: "sticky",
    top: "100px",
  },
  contentArea: {
    flex: 1,
    backgroundColor: theme.white,
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    border: `1px solid ${theme.border}`,
    minHeight: "600px",
    position: "relative",
  },

  // Profile & Data
  sectionTitle: {
    margin: "0 0 24px 0",
    color: theme.textMain,
    fontSize: "22px",
    fontWeight: "700",
    borderBottom: `2px solid ${theme.border}`,
    paddingBottom: "12px",
  },
  profileGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  profileBox: {
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
  },
  profileLabel: {
    fontWeight: "600",
    color: theme.textMuted,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  },
  profileValue: { fontWeight: "700", color: theme.textMain, fontSize: "16px" },

  // Table
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
    textAlign: "left",
  },
  th: {
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderBottom: `1px solid ${theme.border}`,
    color: theme.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "16px",
    borderBottom: `1px solid ${theme.border}`,
    color: "#334155",
  },

  summaryContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "30px",
  },
  summaryBox: {
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center",
    border: `1px solid ${theme.border}`,
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
  },
};

// ==========================================
// REUSABLE SIDEBAR BUTTON
// ==========================================
const SidebarButton = ({ active, children, onClick }) => {
  const [hover, setHover] = useState(false);

  const btnStyle = {
    display: "block",
    width: "100%",
    padding: "14px 16px",
    margin: "0 0 8px 0",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    transition: "all 0.2s ease",
    border: "none",
    backgroundColor: active ? "#eff6ff" : hover ? "#f8fafc" : "transparent",
    color: active ? "#2563eb" : "#475569",
    fontWeight: active ? "700" : "500",
  };

  return (
    <button
      style={btnStyle}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};

// ==========================================
// 1. LOGIN SCREEN COMPONENT
// ==========================================
const LoginScreen = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (studentId === "IM/2020/090") {
        onLoginSuccess({
          nameWithInitial: "Mr H.T.V. FERNANDO",
          fullName: "Mr HETTIYAKANDAGE THEEKSHANA VIMUKTHI FERNANDO",
          studentId: "IM/2020/090",
          academicYear: "2020/2021",
        });
      } else {
        setError("Invalid credentials. Please use IM/2020/090");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginWrapper}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>Kelaniya Science</h1>
          <p style={styles.loginSub}>Student Information System</p>

          {error && (
            <div
              style={{
                ...styles.errorMsg,
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#475569",
                marginBottom: "6px",
              }}
            >
              Student ID
            </label>
            <input
              style={styles.input}
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="IM/2020/090"
            />

            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#475569",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              style={styles.input}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <button
              type="submit"
              style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Authenticating..." : "Secure Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. DATA TABLE COMPONENT
// ==========================================
const ResultsTable = ({ title, data }) => {
  if (!data || !data.courses)
    return (
      <div>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#94a3b8",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            border: "2px dashed #e2e8f0",
          }}
        >
          No data has been published for this section yet.
        </div>
      </div>
    );

  const getStatusBadge = (status) => {
    if (!status || status.trim() === "")
      return <span style={{ color: "#cbd5e1" }}>-</span>;
    if (status.includes("Absent"))
      return (
        <span
          style={{
            ...styles.badge,
            backgroundColor: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {status}
        </span>
      );
    if (status.includes("Approved"))
      return (
        <span
          style={{
            ...styles.badge,
            backgroundColor: "#fef3c7",
            color: "#92400e",
          }}
        >
          {status}
        </span>
      );
    return (
      <span
        style={{
          ...styles.badge,
          backgroundColor: "#f1f5f9",
          color: "#475569",
        }}
      >
        {status}
      </span>
    );
  };

  const getGradeStyle = (grade) => {
    if (!grade || grade.trim() === "") return { color: "#cbd5e1" };
    if (["A+", "A", "A-", "Pass", "Complete"].includes(grade))
      return { color: "#15803d", fontWeight: "800" };
    if (["B+", "B", "B-"].includes(grade))
      return { color: "#2563eb", fontWeight: "800" };
    if (["C+", "C", "C-"].includes(grade))
      return { color: "#d97706", fontWeight: "800" };
    return { color: "#64748b", fontWeight: "800" };
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: theme.textMain,
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          {title}
        </h2>
        <span
          style={{
            backgroundColor: "#eff6ff",
            color: "#2563eb",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          {data.courses.length} Records
        </span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Course Code</th>
              <th style={styles.th}>Course Name</th>
              <th style={styles.th}>Year</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Attempt</th>
              <th style={styles.th}>Status</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.courses.map((course, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? theme.white : "#f8fafc",
                }}
              >
                <td
                  style={{ ...styles.td, fontWeight: "700", color: "#0f172a" }}
                >
                  {course.code}
                </td>
                <td style={{ ...styles.td, fontWeight: "500" }}>
                  {course.name || "-"}
                </td>
                <td style={{ ...styles.td, color: "#64748b" }}>
                  {course.acYear}
                </td>
                <td style={{ ...styles.td, textAlign: "center" }}>
                  <span
                    style={{
                      backgroundColor: "#e2e8f0",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {course.attempt}
                  </span>
                </td>
                <td style={styles.td}>{getStatusBadge(course.status)}</td>
                <td
                  style={{
                    ...styles.td,
                    textAlign: "center",
                    ...getGradeStyle(course.grade),
                  }}
                >
                  {course.grade || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.summary && (
        <div style={styles.summaryContainer}>
          <div
            style={{
              ...styles.summaryBox,
              backgroundColor: "#eff6ff",
              borderColor: "#bfdbfe",
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#3b82f6",
                fontSize: "12px",
                fontWeight: "800",
                textTransform: "uppercase",
              }}
            >
              Total Credits
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "32px",
                color: "#1e3a8a",
                fontWeight: "800",
              }}
            >
              {data.summary.totalCredit || "0"}
            </h2>
          </div>
          <div
            style={{
              ...styles.summaryBox,
              backgroundColor: "#f8fafc",
              borderColor: "#e2e8f0",
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#64748b",
                fontSize: "12px",
                fontWeight: "800",
                textTransform: "uppercase",
              }}
            >
              Non-GPA Credits
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "32px",
                color: "#334155",
                fontWeight: "800",
              }}
            >
              {data.summary.nonGpaCredit || "0"}
            </h2>
          </div>
          <div
            style={{
              ...styles.summaryBox,
              backgroundColor: "#f0fdf4",
              borderColor: "#bbf7d0",
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#22c55e",
                fontSize: "12px",
                fontWeight: "800",
                textTransform: "uppercase",
              }}
            >
              Current GPA
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "32px",
                color: "#166534",
                fontWeight: "800",
              }}
            >
              {data.summary.gpa || "N/A"}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. STUDENT DASHBOARD COMPONENT
// ==========================================
const StudentDashboard = ({ profile, onLogout }) => {
  const [activeView, setActiveView] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const actions = [
    { id: "FirstYearResultBT", label: "Registration - Year 1" },
    { id: "SecondYearResultBT", label: "Registration - Year 2" },
    { id: "ThirdYearResultBT", label: "Registration - Year 3" },
    { id: "FourthYearResultBT", label: "Registration - Year 4" },
    { id: "Std_AdmissionBT", label: "Exam Admission" },
    { id: "Std_RepeatRegistrationBT", label: "Registration - Repeat" },
  ];

  // ALL RAW DATA FROM YOUR HTML FILES (Years 1, 2, 3, and 4)
  const database = {
    FirstYearResultBT: {
      title: "Year 1 Results",
      courses: [
        {
          code: "ACLT 11013",
          name: "ACADEMIC LITERACY I",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "C",
        },
        {
          code: "ACLT 12022",
          name: "ACADEMIC LITERACY II",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "CMSK 14042",
          name: "INTRODUCTION TO COMPUTER HARDWARE...",
          acYear: "2020/2021",
          attempt: "1",
          status: "Incomplete",
          grade: "--",
        },
        {
          code: "CMSK 14042",
          name: "INTRODUCTION TO COMPUTER HARDWARE...",
          acYear: "2023/2024",
          attempt: "2",
          status: "",
          grade: "Complete",
        },
        {
          code: "DELT 11232",
          name: "ENGLISH FOR PROFESSIONALS",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "B+",
        },
        {
          code: "GNCT 11212",
          name: "PERSONAL PROGRESS DEVELOPMENT I",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "Pass",
        },
        {
          code: "GNCT 12212",
          name: "PROBLEM SOLVING AND CRITICAL THINKING",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "Pass",
        },
        {
          code: "INTE 11213",
          name: "FUNDAMENTALS OF COMPUTING",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "INTE 11223",
          name: "PROGRAMMING CONCEPTS",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "INTE 12213",
          name: "OBJECT ORIENTED PROGRAMMING",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "B-",
        },
        {
          code: "INTE 12223",
          name: "DATABASE DESIGN AND DEVELOPMENT",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "C+",
        },
        {
          code: "INTE 12232",
          name: "COMPUTER NETWORK I",
          acYear: "2020/2021",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "INTE 12232",
          name: "COMPUTER NETWORK I",
          acYear: "2021/2022",
          attempt: "2",
          status: "Medical Approved",
          grade: "B+",
        },
        {
          code: "MGTE 11202",
          name: "ECONOMICS",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "MGTE 11213",
          name: "STATISTICS",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "MGTE 11222",
          name: "PRINCIPLES OF MANAGEMENT",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "MGTE 12222",
          name: "OPTIMIZATION METHODS IN MANAGEMENT...",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "MGTE 12232",
          name: "INDUSTRY AND TECHNOLOGY",
          acYear: "2020/2021",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "MGTE 12253",
          name: "ACCOUNTING CONCEPTS AND COSTING",
          acYear: "2020/2021",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "MGTE 12253",
          name: "ACCOUNTING CONCEPTS AND COSTING",
          acYear: "2022/2023",
          attempt: "2",
          status: "Medical Approved",
          grade: "A",
        },
        {
          code: "PMAT 11212",
          name: "MATHEMATICS FOR COMPUTING I",
          acYear: "2020/2021",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "PMAT 11212",
          name: "MATHEMATICS FOR COMPUTING I",
          acYear: "2021/2022",
          attempt: "2",
          status: "Medical Approved",
          grade: "B-",
        },
        {
          code: "PMAT 12212",
          name: "MATHEMATICS FOR COMPUTING II",
          acYear: "2020/2021",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "PMAT 12212",
          name: "MATHEMATICS FOR COMPUTING II",
          acYear: "2021/2022",
          attempt: "2",
          status: "Medical Approved",
          grade: "B",
        },
      ],
      summary: { totalCredit: 45, nonGpaCredit: 11, gpa: "3.370000" },
    },
    SecondYearResultBT: {
      title: "Year 2 Results",
      courses: [
        {
          code: "DELT 21222",
          name: "COMMUNICATION SKILLS FOR PROFESSIONALS",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "GNCT 21212",
          name: "PERSONAL PROGRESS DEVELOPMENT II",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "Pass",
        },
        {
          code: "GNCT 22212",
          name: "TECHNICAL WRITING",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "A-",
        },
        {
          code: "INTE 21213",
          name: "INFORMATION SYSTEMS MODELLING",
          acYear: "2021/2022",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "INTE 21213",
          name: "INFORMATION SYSTEMS MODELLING",
          acYear: "2022/2023",
          attempt: "2",
          status: "Medical Approved",
          grade: "B+",
        },
        {
          code: "INTE 21233",
          name: "WEB APPLICATION DEVELOPMENT I",
          acYear: "2021/2022",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "INTE 21233",
          name: "WEB APPLICATION DEVELOPMENT I",
          acYear: "2023/2024",
          attempt: "2",
          status: "",
          grade: "C",
        },
        {
          code: "INTE 21243",
          name: "COMPUTER ARCHITECTURE AND OPERATING...",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "A-",
        },
        {
          code: "INTE 21263",
          name: "DATA STRUCTURES AND ALGORITHMS",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "C",
        },
        {
          code: "INTE 21273",
          name: "DATA SCIENCE",
          acYear: "2021/2022",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "INTE 21273",
          name: "DATA SCIENCE",
          acYear: "2022/2023",
          attempt: "2",
          status: "Medical Approved",
          grade: "B",
        },
        {
          code: "INTE 21292",
          name: "INFORMATION SECURITY I",
          acYear: "2021/2022",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "INTE 21292",
          name: "INFORMATION SECURITY I",
          acYear: "2023/2024",
          attempt: "2",
          status: "",
          grade: "C",
        },
        {
          code: "INTE 22212",
          name: "SOFTWARE DESIGN PATTERNS AND FRAMEWORKS",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "C",
        },
        {
          code: "INTE 22242",
          name: "WEB APPLICATIONS DEVELOPMENT II",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "INTE 22253",
          name: "DISTRIBUTED SYSTEMS AND CLOUD COMPUTING",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "INTE 22283",
          name: "MOBILE APPLICATIONS DEVELOPMENT",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "A+",
        },
        {
          code: "INTE 22293",
          name: "SOFTWARE ARCHITECTURE AND PROCESS MODELS",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "B+",
        },
        {
          code: "INTE 22303",
          name: "ARTIFICIAL INTELLIGENCE",
          acYear: "2021/2022",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "INTE 22303",
          name: "ARTIFICIAL INTELLIGENCE",
          acYear: "2022/2023",
          attempt: "2",
          status: "Medical Approved",
          grade: "C+",
        },
        {
          code: "INTE 22313",
          name: "INTERACTIVE APPLICATIONS DEVELOPMENT",
          acYear: "2021/2022",
          attempt: "1",
          status: "",
          grade: "B-",
        },
      ],
      summary: { totalCredit: 42, nonGpaCredit: 4, gpa: "2.840000" },
    },
    ThirdYearResultBT: {
      title: "Year 3 Results",
      courses: [
        {
          code: "GNCT 32216",
          name: "INTERNSHIP",
          acYear: "2022/2023",
          attempt: "1",
          status: "",
          grade: "A+",
        },
        {
          code: "INTE 31213",
          name: "ADVANCED DATABASES",
          acYear: "2022/2023",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "INTE 31213",
          name: "ADVANCED DATABASES",
          acYear: "2023/2024",
          attempt: "2",
          status: "Medical Approved",
          grade: "C+",
        },
        {
          code: "INTE 31233",
          name: "HUMAN COMPUTER INTERACTION",
          acYear: "2022/2023",
          attempt: "1",
          status: "",
          grade: "B-",
        },
        {
          code: "INTE 31243",
          name: "SOFTWARE QUALITY ENGINEERING",
          acYear: "2022/2023",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "INTE 31273",
          name: "SYSTEM INTEGRATION TECHNOLOGIES - 1",
          acYear: "2022/2023",
          attempt: "1",
          status: "Absent",
          grade: "**",
        },
        {
          code: "INTE 31273",
          name: "SYSTEM INTEGRATION TECHNOLOGIES - 1",
          acYear: "2023/2024",
          attempt: "2",
          status: "Medical Approved",
          grade: "B-",
        },
        {
          code: "INTE 31356",
          name: "SOFTWARE DEVELOPMENT PROJECT",
          acYear: "2022/2023",
          attempt: "1",
          status: "",
          grade: "A-",
        },
        {
          code: "INTE 31382",
          name: "SYSTEM ADMINISTRATION AND MAINTENANCE",
          acYear: "2022/2023",
          attempt: "1",
          status: "",
          grade: "B-",
        },
        {
          code: "MGTE 31212",
          name: "PROJECT MANAGEMENT",
          acYear: "2022/2023",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "MGTE 31222",
          name: "RESEARCH METHODS",
          acYear: "2022/2023",
          attempt: "1",
          status: "",
          grade: "B-",
        },
      ],
      summary: { totalCredit: 30, nonGpaCredit: "", gpa: "3.170000" },
    },
    FourthYearResultBT: {
      title: "Year 4 Results",
      courses: [
        {
          code: "INTE 41292",
          name: "MOBILE COMPUTING",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "INTE 41302",
          name: "GEOGRAPHICAL INFORMATION SYSTEMS",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "INTE 41323",
          name: "NEURAL NETWORKS AND DEEP LEARNING",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "INTE 41342",
          name: "INDUSTRIAL AUTOMATION",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "B-",
        },
        {
          code: "INTE 41352",
          name: "SYSTEM INTEGRATION TECHNOLOGIES - 2",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "INTE 42232",
          name: "DATA ENGINEERING",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "INTE 42252",
          name: "SEMANTIC WEB AND ONTOLOGICAL ENGINEERING",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "A-",
        },
        {
          code: "INTE 43216",
          name: "RESEARCH PROJECT",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "A",
        },
        {
          code: "INTE 44363",
          name: "",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "",
        },
        {
          code: "MGTE 41212",
          name: "PROFESSIONAL PRACTICES",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "B",
        },
        {
          code: "MGTE 41222",
          name: "BUSINESS PROCESS ENGINEERING",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "C+",
        },
        {
          code: "MGTE 44273",
          name: "INNOVATION & ENTREPRENEURSHIP",
          acYear: "2023/2024",
          attempt: "1",
          status: "",
          grade: "A",
        },
      ],
      summary: { totalCredit: 31, nonGpaCredit: "", gpa: "3.240000" },
    },
  };

  const handleNavClick = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveView(id);
      setIsLoading(false);
    }, 400); // simulate network fetch
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div>
          <h1 style={styles.navTitle}>University of Kelaniya</h1>
          <p style={styles.navSub}>Faculty of Science • Student Portal</p>
        </div>
        <button onClick={onLogout} style={styles.btnLogout}>
          Log Out
        </button>
      </nav>

      <div style={styles.mainLayout}>
        <div style={styles.sidebar}>
          <SidebarButton
            active={activeView === "profile"}
            onClick={() => handleNavClick("profile")}
          >
            <span style={{ marginRight: "10px" }}>👤</span> My Profile
          </SidebarButton>

          <hr
            style={{
              border: "none",
              borderTop: `1px solid ${theme.border}`,
              margin: "16px 0",
            }}
          />
          <p
            style={{
              fontSize: "11px",
              fontWeight: "800",
              color: theme.textMuted,
              margin: "0 0 12px 10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Academic Records
          </p>

          {actions.map((action) => (
            <SidebarButton
              key={action.id}
              active={activeView === action.id}
              onClick={() => handleNavClick(action.id)}
            >
              <span style={{ marginRight: "10px" }}>📄</span> {action.label}
            </SidebarButton>
          ))}
        </div>

        <div style={styles.contentArea}>
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255,255,255,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                borderRadius: "16px",
              }}
            >
              <div
                style={{
                  padding: "20px 40px",
                  backgroundColor: theme.white,
                  borderRadius: "30px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  color: theme.primary,
                  fontWeight: "700",
                }}
              >
                Fetching Records...
              </div>
            </div>
          )}

          {!isLoading && activeView === "profile" && (
            <div>
              <h2 style={styles.sectionTitle}>Personal Information</h2>

              <div style={styles.profileGrid}>
                <div style={styles.profileBox}>
                  <div style={styles.profileLabel}>Name with Initials</div>
                  <div style={styles.profileValue}>
                    {profile.nameWithInitial}
                  </div>
                </div>
                <div style={styles.profileBox}>
                  <div style={styles.profileLabel}>University ID No</div>
                  <div style={styles.profileValue}>{profile.studentId}</div>
                </div>
                <div style={{ ...styles.profileBox, gridColumn: "1 / -1" }}>
                  <div style={styles.profileLabel}>Full Name</div>
                  <div style={styles.profileValue}>{profile.fullName}</div>
                </div>
                <div style={styles.profileBox}>
                  <div style={styles.profileLabel}>Academic Year</div>
                  <div style={{ ...styles.profileValue, color: theme.primary }}>
                    {profile.academicYear}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && activeView !== "profile" && (
            <ResultsTable
              title={
                actions.find((a) => a.id === activeView)?.label + " Results"
              }
              data={database[activeView]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP CONTROLLER
// ==========================================
export default function App() {
  const [studentProfile, setStudentProfile] = useState(null);

  return (
    <>
      {!studentProfile ? (
        <LoginScreen onLoginSuccess={setStudentProfile} />
      ) : (
        <StudentDashboard
          profile={studentProfile}
          onLogout={() => setStudentProfile(null)}
        />
      )}
    </>
  );
}
