import React, { useState, useEffect, useMemo } from "react";

const PROXY_URL = "https://proxy.geargrid.live/api/faculty"; // Your secure Vercel-ready endpoint

const GRADE_POINTS = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  E: 0.0,
};

const App = () => {
  const [sessionUrl, setSessionUrl] = useState("/sfkn.aspx");
  const [tokens, setTokens] = useState(null);
  const [student, setStudent] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(false);

  const [hydrationProgress, setHydrationProgress] = useState(0);
  const [cachedHtml, setCachedHtml] = useState({});
  const [gpaData, setGpaData] = useState({});
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- CORE SCRAPER ---
  const parseAndCache = (htmlText, finalUrl, targetId = null) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    if (finalUrl) {
      try {
        setSessionUrl(new URL(finalUrl).pathname);
      } catch (e) {}
    }

    const nextTokens = {
      viewState: doc.getElementById("__VIEWSTATE")?.value || "",
      generator: doc.getElementById("__VIEWSTATEGENERATOR")?.value || "",
      validation: doc.getElementById("__EVENTVALIDATION")?.value || "",
    };
    setTokens(nextTokens);

    const nameWithInitial = doc.getElementById("NameWithInitialLb")?.innerText;
    if (nameWithInitial && nameWithInitial !== "N/A") {
      setStudent({
        shortName: nameWithInitial,
        fullName: doc.getElementById("FullName")?.innerText,
        id: doc.getElementById("StdIDNo")?.innerText,
        year: doc.getElementById("PubAcYear")?.innerText,
      });
    }

    const middlePanel = doc.getElementById("Panel_Middle");
    if (middlePanel && targetId) {
      setCachedHtml((prev) => ({ ...prev, [targetId]: middlePanel.innerHTML }));
      calculateYearlyGPA(middlePanel, targetId);
    }
    return nextTokens;
  };

  // --- ADVANCED GPA SCRAPER ---
  const calculateYearlyGPA = (panelNode, yearId) => {
    const rows = panelNode.querySelectorAll("tr");
    let pts = 0,
      crd = 0;

    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll("td")).map((c) =>
        c.innerText.trim(),
      );
      if (cells.length < 2) return;

      // 1. Scan backwards to find the grade (Grades are usually at the end)
      const reversedCells = [...cells].reverse();
      const grade = reversedCells.find((t) => GRADE_POINTS.hasOwnProperty(t));

      // 2. Identify the Credit Value safely
      let credit = 0;

      // Strategy A: Look for Kelaniya Subject Code format (e.g., IMAT 11212)
      // The 5th digit of the number part is usually the credit value.
      const codeCell = cells.find((t) => /^[A-Z]{4}\s*\d{5}$/i.test(t));
      if (codeCell) {
        const digits = codeCell.match(/\d{5}/)[0];
        credit = parseInt(digits.charAt(4)); // Gets the 5th digit
      }

      // Strategy B: If no Subject Code found, look for a standalone number from right-to-left
      // This prevents grabbing the "1" or "2" from the Serial Number column.
      if (credit === 0 || isNaN(credit)) {
        const creditStr = reversedCells.find((t) => /^[1-8](\.0)?$/.test(t));
        credit = parseFloat(creditStr);
      }

      // Calculate if data is valid
      if (grade && !isNaN(credit) && credit > 0) {
        pts += GRADE_POINTS[grade] * credit;
        crd += credit;
      }
    });

    if (crd > 0) {
      setGpaData((prev) => ({
        ...prev,
        [yearId]: {
          points: pts, // Storing raw points eliminates rounding errors in Cumulative GPA
          credits: crd,
          gpa: (pts / crd).toFixed(2),
        },
      }));
    }
  };

  const cumulativeGPA = useMemo(() => {
    const vals = Object.values(gpaData);
    if (vals.length === 0) return "0.00";

    // Sum raw points directly to avoid cumulative rounding errors
    const totalPts = vals.reduce((a, c) => a + c.points, 0);
    const totalCrd = vals.reduce((a, c) => a + c.credits, 0);

    return totalCrd === 0 ? "0.00" : (totalPts / totalCrd).toFixed(2);
  }, [gpaData]);

  // --- SELF-HEALING ENGINE ---
  const silentReAuthenticate = async () => {
    const initRes = await fetch(`${PROXY_URL}/sfkn.aspx`);
    const initHtml = await initRes.text();
    const parser = new DOMParser();
    const initDoc = parser.parseFromString(initHtml, "text/html");

    const body = new URLSearchParams();
    body.append(
      "__VIEWSTATE",
      initDoc.getElementById("__VIEWSTATE")?.value || "",
    );
    body.append(
      "__VIEWSTATEGENERATOR",
      initDoc.getElementById("__VIEWSTATEGENERATOR")?.value || "",
    );
    body.append(
      "__EVENTVALIDATION",
      initDoc.getElementById("__EVENTVALIDATION")?.value || "",
    );
    body.append("Usernametxt", credentials.uid);
    body.append("PasswordTxt", credentials.pwd); // Will pass empty string if optional
    body.append("LoginBT", "Sign in");

    const loginRes = await fetch(`${PROXY_URL}/sfkn.aspx`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const loginHtml = await loginRes.text();
    const finalUrl =
      loginRes.headers.get("X-Final-Url") ||
      loginRes.headers.get("X-Final-URL");
    return parseAndCache(loginHtml, finalUrl);
  };

  const hydrateAllYears = async (initialTokens, creds) => {
    const years = [
      "FirstYearResultBT",
      "SecondYearResultBT",
      "ThirdYearResultBT",
      "FourthYearResultBT",
    ];
    let currentTokens = initialTokens;

    for (let i = 0; i < years.length; i++) {
      const target = years[i];
      let success = false;
      let attempts = 0;

      while (!success && attempts < 3) {
        attempts++;
        try {
          const body = new URLSearchParams();
          body.append("__EVENTTARGET", target);
          body.append("__VIEWSTATE", currentTokens.viewState);
          body.append("__VIEWSTATEGENERATOR", currentTokens.generator);
          body.append("__EVENTVALIDATION", currentTokens.validation);

          const res = await fetch(`${PROXY_URL}${sessionUrl}`, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });

          if (!res.ok) throw new Error("500 Bad Gateway");
          const html = await res.text();

          if (html.includes("Error") || html.length < 1000)
            throw new Error("Invalid ViewState");

          const finalUrlHeader =
            res.headers.get("X-Final-Url") || res.headers.get("X-Final-URL");
          currentTokens = parseAndCache(html, finalUrlHeader, target);
          success = true;
        } catch (err) {
          if (attempts === 2) currentTokens = await silentReAuthenticate();
        }
      }
      setHydrationProgress(i + 1);
    }
  };

  // --- INITIALIZATION & AUTH ---
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${PROXY_URL}/sfkn.aspx`);
        const html = await res.text();
        const finalUrlHeader =
          res.headers.get("X-Final-Url") || res.headers.get("X-Final-URL");
        parseAndCache(html, finalUrlHeader);
      } catch (err) {
        setTokens({ viewState: "", generator: "", validation: "" });
      }
    };
    init();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);

    // Optional password support (falls back to empty string if undefined)
    const currentCreds = { uid: fd.get("uid"), pwd: fd.get("pwd") || "" };
    setCredentials(currentCreds);

    const body = new URLSearchParams();
    body.append("__VIEWSTATE", tokens.viewState);
    body.append("__VIEWSTATEGENERATOR", tokens.generator);
    body.append("__EVENTVALIDATION", tokens.validation);
    body.append("Usernametxt", currentCreds.uid);
    body.append("PasswordTxt", currentCreds.pwd);
    body.append("LoginBT", "Sign in");

    try {
      const res = await fetch(`${PROXY_URL}${sessionUrl}`, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const html = await res.text();
      const finalUrlHeader =
        res.headers.get("X-Final-Url") || res.headers.get("X-Final-URL");
      const newTokens = parseAndCache(html, finalUrlHeader);

      if (html.includes("NameWithInitialLb"))
        hydrateAllYears(newTokens, currentCreds);
      else alert("Invalid Credentials or System Offline");
    } catch (err) {
      alert("Login Error: Server Unreachable");
    } finally {
      setLoading(false);
    }
  };

  // --- INJECT RESPONSIVE CSS ---
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body, html { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; background: #fff; }
      .app-container { display: flex; height: 100vh; width: 100vw; background: #fff; color: #000; }
      .sidebar { width: 260px; background: #000; color: #fff; display: flex; flex-direction: column; transition: transform 0.3s ease; z-index: 1000; }
      .main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; width: 100%; position: relative; }
      .header-mobile { display: none; padding: 15px 20px; border-bottom: 2px solid #000; align-items: center; justify-content: space-between; }
      .menu-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #000; padding: 0; }
      .gpa-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
      .overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; }
      table { width: 100% !important; border-collapse: collapse; }
      td, th { border: 1px solid #000; padding: 8px; text-align: left; }
      .table-wrapper { overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
      
      @media (max-width: 768px) {
        .sidebar { position: fixed; height: 100vh; transform: translateX(-100%); }
        .sidebar.open { transform: translateX(0); }
        .header-mobile { display: flex; }
        .desktop-header-title { display: none; }
        .top-bar { padding: 10px 15px; }
        .gpa-grid { grid-template-columns: 1fr; }
        .overlay.open { display: block; }
        .profile-info { text-align: right; }
        .auth-card { width: 90% !important; padding: 25px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!tokens)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        Connecting to Server...
      </div>
    );

  if (!student)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <div
          className="auth-card"
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "12px",
            width: "350px",
            border: "3px solid #000",
            boxShadow: "8px 8px 0px #000",
          }}
        >
          <h2 style={{ margin: "0 0 5px 0", color: "#000", fontWeight: "900" }}>
            FIS Portal
          </h2>
          <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#000" }}>
            Enter university credentials
          </p>
          <form onSubmit={handleLogin}>
            {/* Explicitly set backgroundColor and color to prevent dark-mode invisible text issues */}
            <input
              name="uid"
              placeholder="ID (IM/2020/090)"
              style={{
                width: "100%",
                padding: "14px",
                margin: "10px 0",
                border: "2px solid #000",
                borderRadius: "6px",
                fontWeight: "bold",
                boxSizing: "border-box",
                backgroundColor: "#fff",
                color: "#000",
              }}
              required
            />
            {/* Removed 'required' attribute here to allow password-less logins */}
            <input
              name="pwd"
              type="password"
              placeholder="Password (Optional)"
              style={{
                width: "100%",
                padding: "14px",
                margin: "10px 0 20px",
                border: "2px solid #000",
                borderRadius: "6px",
                fontWeight: "bold",
                boxSizing: "border-box",
                backgroundColor: "#fff",
                color: "#000",
              }}
            />
            <button
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "900",
                fontSize: "16px",
              }}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );

  return (
    <div className="app-container">
      <div
        className={`overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div
          style={{
            padding: "25px 20px",
            fontSize: "22px",
            fontWeight: "900",
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>FIS v2.0</span>
          {isMobileMenuOpen && (
            <button
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "20px",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ✕
            </button>
          )}
        </div>
        <nav style={{ flex: 1, padding: "10px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#888",
              textTransform: "uppercase",
              padding: "20px 10px 10px",
              fontWeight: "bold",
            }}
          >
            Academic Records
          </div>
          {[
            "FirstYearResultBT",
            "SecondYearResultBT",
            "ThirdYearResultBT",
            "FourthYearResultBT",
          ].map((id, i) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setIsMobileMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "14px",
                background: activeTab === id ? "#222" : "none",
                border: "none",
                color: "#fff",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: "bold",
                borderRadius: "6px",
              }}
            >
              Year {i + 1} {cachedHtml[id] ? "✅" : "⏳"}
            </button>
          ))}
          <div
            style={{
              fontSize: "11px",
              color: "#888",
              textTransform: "uppercase",
              padding: "20px 10px 10px",
              fontWeight: "bold",
            }}
          >
            Analytics
          </div>
          <button
            onClick={() => {
              setActiveTab("GPA");
              setIsMobileMenuOpen(false);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              background: activeTab === "GPA" ? "#222" : "none",
              border: "none",
              color: "#fff",
              textAlign: "left",
              cursor: "pointer",
              fontWeight: "bold",
              borderRadius: "6px",
            }}
          >
            📊 GPA Overview
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "30px",
              width: "100%",
              padding: "12px",
              background: "#ff4757",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Secure Logout
          </button>
        </nav>
        {hydrationProgress > 0 && hydrationProgress < 4 && (
          <div
            style={{
              padding: "15px",
              fontSize: "12px",
              textAlign: "center",
              background: "#111",
              fontWeight: "bold",
            }}
          >
            Syncing Database: {hydrationProgress}/4
          </div>
        )}
      </aside>

      <main className="main-content">
        <header className="header-mobile">
          <button
            className="menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            ☰
          </button>
          <div style={{ fontWeight: "900", fontSize: "18px", color: "#000" }}>
            {activeTab.replace("ResultBT", "")}
          </div>
        </header>

        <header
          className="top-bar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 30px",
            borderBottom: "2px solid #000",
          }}
        >
          <div
            className="desktop-header-title"
            style={{ fontWeight: "900", fontSize: "20px", color: "#000" }}
          >
            {activeTab.replace("ResultBT", "")}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginLeft: "auto",
            }}
          >
            <div className="profile-info">
              <div
                style={{ fontWeight: "900", fontSize: "15px", color: "#000" }}
              >
                {student.shortName}
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}
              >
                {student.id}
              </div>
            </div>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#000",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {student.shortName.charAt(3)}
            </div>
          </div>
        </header>

        <div style={{ padding: "20px", color: "#000" }}>
          {activeTab === "GPA" ? (
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontWeight: "900", margin: "10px 0" }}>
                Cumulative GPA
              </h1>
              <div
                style={{
                  fontSize: "64px",
                  fontWeight: "900",
                  background: "#000",
                  color: "#fff",
                  padding: "30px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  boxShadow: "6px 6px 0px #ccc",
                }}
              >
                {cumulativeGPA}
              </div>
              <div className="gpa-grid">
                {Object.entries(gpaData).map(([year, d]) => (
                  <div
                    key={year}
                    style={{
                      padding: "20px",
                      border: "3px solid #000",
                      borderRadius: "12px",
                      textAlign: "left",
                      boxShadow: "4px 4px 0px #000",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "900",
                        fontSize: "18px",
                        borderBottom: "2px solid #000",
                        paddingBottom: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      {year.replace("ResultBT", "")}
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "900" }}>
                      GPA: {d.gpa}
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      Credits Evaluated: {d.credits}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  border: "3px solid #000",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "4px 4px 0px #000",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Student Name:{" "}
                  <span style={{ fontWeight: "500" }}>{student.fullName}</span>
                </div>
                <div style={{ fontWeight: "bold" }}>
                  Handbook Year:{" "}
                  <span style={{ fontWeight: "500" }}>{student.year}</span>
                </div>
              </div>
              <div
                style={{
                  border: "3px solid #000",
                  borderRadius: "8px",
                  padding: "20px",
                  background: "#fafafa",
                }}
              >
                <div
                  className="table-wrapper"
                  dangerouslySetInnerHTML={{
                    __html:
                      cachedHtml[activeTab] ||
                      `<div style="text-align:center; padding: 40px; font-weight: bold;">Loading / Recovering Data...</div>`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
