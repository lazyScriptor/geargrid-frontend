import React, { useState, useEffect } from "react";

// --- SVG Icons for UI Polish (No external libraries needed) ---
const Icons = {
  User: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Book: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  LogOut: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  Spinner: () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  ),
};

// ==========================================
// 1. LOGIN SCREEN COMPONENT
// ==========================================
const LoginScreen = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (studentId === "IM/2020/090") {
        const initialScrapedData = {
          profile: {
            nameWithInitial: "Mr H.T.V. FERNANDO",
            fullName: "Mr HETTIYAKANDAGE THEEKSHANA VIMUKTHI FERNANDO",
            studentId: "IM/2020/090",
            academicYear: "2020/2021",
          },
          availableActions: [
            { id: "FirstYearResultBT", label: "Registration - Year 1" },
            { id: "SecondYearResultBT", label: "Registration - Year 2" },
            { id: "ThirdYearResultBT", label: "Registration - Year 3" },
            { id: "FourthYearResultBT", label: "Registration - Year 4" },
            { id: "Std_AdmissionBT", label: "Exam Admission" },
            { id: "Std_RepeatRegistrationBT", label: "Registration - Repeat" },
          ],
        };
        onLoginSuccess(initialScrapedData);
      } else {
        setError("Invalid credentials. Please use IM/2020/090 for this demo.");
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
            <Icons.Book />
            <span className="text-white text-3xl font-serif font-bold italic ml-2">
              K
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Science Faculty
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Student Portal Access
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              required
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="IM/2020/090"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex justify-center items-center mt-6
              ${isLoading ? "bg-blue-400 shadow-none" : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5"}`}
          >
            {isLoading ? (
              <>
                <Icons.Spinner /> Authenticating...
              </>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. REUSABLE DATA TABLE COMPONENT
// ==========================================
const DataTable = ({ title, data }) => {
  if (!data) return null;

  // Helper to colorize grades
  const getGradeColor = (grade) => {
    if (["A+", "A", "A-", "Complete", "Pass"].includes(grade))
      return "text-green-700 bg-green-100 border-green-200";
    if (["B+", "B", "B-"].includes(grade))
      return "text-blue-700 bg-blue-100 border-blue-200";
    if (["C+", "C", "C-"].includes(grade))
      return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-gray-600 bg-gray-100 border-gray-200";
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold border border-blue-100">
          {data.courses.length} Records
        </span>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto shadow-sm ring-1 ring-gray-200 rounded-2xl bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80 backdrop-blur-sm">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Course Code
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Course Name
              </th>
              <th className="px-5 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-5 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Attempt
              </th>
              <th className="px-5 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Grade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.courses.map((course, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50/50 transition-colors duration-150"
              >
                <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-gray-900">
                  {course.code}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 font-medium max-w-xs truncate">
                  {course.name}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-center text-gray-500">
                  {course.acYear}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-center text-gray-500">
                  <span className="bg-gray-100 px-2.5 py-0.5 rounded-md font-semibold text-gray-600">
                    {course.attempt}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-center">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${getGradeColor(course.grade)}`}
                  >
                    {course.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      {data.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center justify-center">
            <p className="text-sm text-blue-600 font-bold uppercase tracking-wide mb-1">
              Total Credits
            </p>
            <p className="text-4xl font-extrabold text-blue-900">
              {data.summary.totalCredit}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col items-center justify-center">
            <p className="text-sm text-indigo-600 font-bold uppercase tracking-wide mb-1">
              Non-GPA Credits
            </p>
            <p className="text-4xl font-extrabold text-indigo-900">
              {data.summary.nonGpaCredit}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl border border-green-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-200 opacity-20 rounded-full blur-xl"></div>
            <p className="text-sm text-green-700 font-bold uppercase tracking-wide mb-1">
              Current GPA
            </p>
            <p className="text-4xl font-extrabold text-green-700">
              {data.summary.gpa}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. STUDENT DASHBOARD COMPONENT
// ==========================================
const StudentDashboard = ({ studentData, onLogout }) => {
  const [activeView, setActiveView] = useState("profile");
  const [viewData, setViewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // MOCK DATABASE: In reality, your Node/Python backend returns this JSON after scraping ASP.NET
  const mockDatabase = {
    FirstYearResultBT: {
      title: "Year 1 Results",
      courses: [
        {
          code: "ACLT 11013",
          name: "ACADEMIC LITERACY I",
          acYear: "2020/2021",
          attempt: "1",
          grade: "C",
        },
        {
          code: "INTE 11213",
          name: "FUNDAMENTALS OF COMPUTING",
          acYear: "2020/2021",
          attempt: "1",
          grade: "A",
        },
        {
          code: "MGTE 11202",
          name: "ECONOMICS",
          acYear: "2020/2021",
          attempt: "1",
          grade: "A",
        },
        {
          code: "PMAT 11212",
          name: "MATHEMATICS FOR COMPUTING I",
          acYear: "2021/2022",
          attempt: "2",
          grade: "B-",
        },
      ],
      summary: { totalCredit: 45, nonGpaCredit: 11, gpa: "3.370" },
    },
    SecondYearResultBT: {
      title: "Year 2 Results",
      courses: [
        {
          code: "INTE 21213",
          name: "DATA STRUCTURES AND ALGORITHMS",
          acYear: "2021/2022",
          attempt: "1",
          grade: "A-",
        },
        {
          code: "MGTE 21202",
          name: "MARKETING MANAGEMENT",
          acYear: "2021/2022",
          attempt: "1",
          grade: "B+",
        },
        {
          code: "PMAT 21212",
          name: "LINEAR ALGEBRA",
          acYear: "2021/2022",
          attempt: "1",
          grade: "A",
        },
      ],
      summary: { totalCredit: 30, nonGpaCredit: 4, gpa: "3.520" },
    },
    Std_AdmissionBT: {
      title: "Exam Admissions (Current)",
      courses: [
        {
          code: "INTE 31213",
          name: "SOFTWARE ENGINEERING",
          acYear: "2022/2023",
          attempt: "1",
          grade: "Pending",
        },
        {
          code: "MGTE 31202",
          name: "STRATEGIC MANAGEMENT",
          acYear: "2022/2023",
          attempt: "1",
          grade: "Pending",
        },
      ],
    },
  };

  const handleActionClick = (action) => {
    setActiveView(action.id);
    setIsLoading(true);

    // Simulate API Call to your middleware scraper
    setTimeout(() => {
      // Fetch mock data or fallback if not built yet
      const fetchedData = mockDatabase[action.id] || {
        title: action.label,
        courses: [
          {
            code: "SYS 0000",
            name: "Data not available in demo yet",
            acYear: "-",
            attempt: "-",
            grade: "-",
          },
        ],
      };

      setViewData(fetchedData);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-serif font-bold italic">
                  K
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  University of Kelaniya
                </h1>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Faculty of Science
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Icons.LogOut /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Menu */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
              <button
                onClick={() => setActiveView("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 mb-6 font-bold rounded-xl transition-all ${
                  activeView === "profile"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icons.User /> My Profile
              </button>

              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-4">
                Academic Records
              </h2>
              <ul className="space-y-1">
                {studentData.availableActions.map((action) => (
                  <li key={action.id}>
                    <button
                      onClick={() => handleActionClick(action)}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between ${
                        activeView === action.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {action.label}
                      {activeView === action.id && (
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="w-full flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 min-h-[600px] relative">
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10 transition-opacity">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-blue-800 font-bold tracking-wide">
                    Syncing records...
                  </p>
                </div>
              )}

              {/* Profile View */}
              {!isLoading && activeView === "profile" && (
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Name with Initials
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {studentData.profile.nameWithInitial}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        University ID
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {studentData.profile.studentId}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 md:col-span-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Full Name
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {studentData.profile.fullName}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Academic Year
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700 mt-1">
                        {studentData.profile.academicYear}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Table View */}
              {!isLoading && activeView !== "profile" && (
                <DataTable title={viewData?.title} data={viewData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Custom CSS for Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `,
        }}
      />
    </div>
  );
};

// ==========================================
// 3. MAIN APP CONTROLLER
// ==========================================
export default function App() {
  const [studentData, setStudentData] = useState(null);

  return (
    <>
      {!studentData ? (
        <LoginScreen onLoginSuccess={setStudentData} />
      ) : (
        <StudentDashboard
          studentData={studentData}
          onLogout={() => setStudentData(null)}
        />
      )}
    </>
  );
}
