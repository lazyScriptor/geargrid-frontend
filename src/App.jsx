import React, { useState, useEffect, useMemo } from "react";

const PROXY_URL = "http://localhost:3001/api/faculty";

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
  const [loading, setLoading] = useState(false);
  const [hydrationProgress, setHydrationProgress] = useState(0);

  // Data Cache
  const [cachedHtml, setCachedHtml] = useState({}); // { Year1ResultBT: "<html>..." }
  const [gpaData, setGpaData] = useState({});
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Helper: Scrape data from ASP.NET response
  const parseAndCache = (htmlText, finalUrl, targetId = null) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    if (finalUrl) setSessionUrl(new URL(finalUrl).pathname);

    // Update tokens for the NEXT request
    const nextTokens = {
      viewState: doc.getElementById("__VIEWSTATE")?.value,
      generator: doc.getElementById("__VIEWSTATEGENERATOR")?.value,
      validation: doc.getElementById("__EVENTVALIDATION")?.value,
    };
    setTokens(nextTokens);

    // Profile Mapping
    const nameWithInitial = doc.getElementById("NameWithInitialLb")?.innerText;
    if (nameWithInitial && nameWithInitial !== "N/A") {
      setStudent({
        shortName: nameWithInitial,
        fullName: doc.getElementById("FullName")?.innerText,
        id: doc.getElementById("StdIDNo")?.innerText,
        year: doc.getElementById("PubAcYear")?.innerText,
      });
    }

    // Content & GPA Scraping
    const middlePanel = doc.getElementById("Panel_Middle");
    if (middlePanel && targetId) {
      setCachedHtml((prev) => ({ ...prev, [targetId]: middlePanel.innerHTML }));
      calculateYearlyGPA(middlePanel, targetId);
    }
    return nextTokens;
  };

  const calculateYearlyGPA = (panelNode, yearId) => {
    const rows = panelNode.querySelectorAll("tr");
    let pts = 0,
      crd = 0;
    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll("td")).map((c) =>
        c.innerText.trim(),
      );
      const grade = cells.find((t) => GRADE_POINTS.hasOwnProperty(t));
      const credit = cells.find((t) => /^[1-4](\.0)?$/.test(t));
      if (grade && credit) {
        pts += GRADE_POINTS[grade] * parseFloat(credit);
        crd += parseFloat(credit);
      }
    });
    if (crd > 0)
      setGpaData((prev) => ({
        ...prev,
        [yearId]: { gpa: (pts / crd).toFixed(2), credits: crd },
      }));
  };

  // Pre-load all data sequentially to prevent session collisions
  const hydrateAllYears = async (initialTokens) => {
    const years = [
      "FirstYearResultBT",
      "SecondYearResultBT",
      "ThirdYearResultBT",
      "FourthYearResultBT",
    ];
    let currentTokens = initialTokens;

    for (let i = 0; i < years.length; i++) {
      setHydrationProgress(i + 1);
      const target = years[i];

      const body = new URLSearchParams();
      body.append("__EVENTTARGET", target);
      body.append("__VIEWSTATE", currentTokens.viewState);
      body.append("__VIEWSTATEGENERATOR", currentTokens.generator);
      body.append("__EVENTVALIDATION", currentTokens.validation);

      try {
        const res = await fetch(`${PROXY_URL}${sessionUrl}`, {
          method: "POST",
          body: body,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const html = await res.text();
        currentTokens = parseAndCache(
          html,
          res.headers.get("X-Final-URL"),
          target,
        );
      } catch (err) {
        console.error(`Failed to cache ${target}`, err);
      }
    }
    setHydrationProgress(100);
  };

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${PROXY_URL}/sfkn.aspx`);
      const html = await res.text();
      parseAndCache(html, res.headers.get("X-Final-URL"));
    };
    init();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const body = new URLSearchParams();
    body.append("__VIEWSTATE", tokens.viewState);
    body.append("__VIEWSTATEGENERATOR", tokens.generator);
    body.append("__EVENTVALIDATION", tokens.validation);
    body.append("Usernametxt", fd.get("uid"));
    body.append("PasswordTxt", fd.get("pwd"));
    body.append("LoginBT", "Sign in");

    try {
      const res = await fetch(`${PROXY_URL}${sessionUrl}`, {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const html = await res.text();
      const newTokens = parseAndCache(html, res.headers.get("X-Final-URL"));

      // Start Background Hydration
      if (html.includes("NameWithInitialLb")) hydrateAllYears(newTokens);
    } catch (err) {
      alert("Login Error: Server Unreachable");
    } finally {
      setLoading(false);
    }
  };

  const cumulativeGPA = useMemo(() => {
    const vals = Object.values(gpaData);
    if (vals.length === 0) return "0.00";
    const pts = vals.reduce((a, c) => a + parseFloat(c.gpa) * c.credits, 0);
    const crd = vals.reduce((a, c) => a + c.credits, 0);
    return (pts / crd).toFixed(2);
  }, [gpaData]);

  if (!tokens)
    return (
      <div style={styles.fullCenter}>Initializing Secure Connection...</div>
    );

  if (!student)
    return (
      <div style={styles.authBg}>
        <div style={styles.loginCard}>
          <h2 style={styles.blackText}>Faculty Portal</h2>
          <form onSubmit={handleLogin}>
            <input
              name="uid"
              placeholder="ID (IM/2020/090)"
              style={styles.blackInput}
              required
            />
            <input
              name="pwd"
              type="password"
              placeholder="Password"
              style={styles.blackInput}
              required
            />
            <button disabled={loading} style={styles.blackBtn}>
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );

  return (
    <div style={styles.dashboard}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>FIS v2.0</div>
        <nav style={styles.nav}>
          <div style={styles.navGroup}>Academic Records</div>
          {[
            "FirstYearResultBT",
            "SecondYearResultBT",
            "ThirdYearResultBT",
            "FourthYearResultBT",
          ].map((id, i) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={styles.navBtn}
            >
              Year {i + 1} {cachedHtml[id] ? "✅" : "⏳"}
            </button>
          ))}
          <div style={styles.navGroup}>Analytics</div>
          <button onClick={() => setActiveTab("GPA")} style={styles.navBtn}>
            📊 Final GPA
          </button>
          <button
            onClick={() => window.location.reload()}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </nav>
        {hydrationProgress > 0 && hydrationProgress < 100 && (
          <div style={styles.progress}>
            Caching: {hydrationProgress}/4 years
          </div>
        )}
      </aside>

      <main style={styles.main}>
        <header style={styles.topBar}>
          <div style={styles.blackText}>
            <b>{activeTab.replace("ResultBT", "")}</b>
          </div>
          <div style={styles.profileInfo}>
            <div style={{ textAlign: "right" }}>
              <div style={styles.blackText}>
                <b>{student.shortName}</b>
              </div>
              <div style={styles.blackText}>
                <small>{student.id}</small>
              </div>
            </div>
            <div style={styles.avatar}>{student.shortName.charAt(3)}</div>
          </div>
        </header>

        <div style={styles.contentContainer}>
          {activeTab === "GPA" ? (
            <div style={styles.gpaContainer}>
              <h1 style={styles.blackText}>Cumulative GPA</h1>
              <div style={styles.gpaHero}>{cumulativeGPA}</div>
              <div style={styles.gpaGrid}>
                {Object.entries(gpaData).map(([year, d]) => (
                  <div key={year} style={styles.gpaCard}>
                    <div style={styles.blackText}>
                      <b>{year.replace("ResultBT", "")}</b>
                    </div>
                    <div style={{ fontSize: "20px", color: "#000" }}>
                      GPA: {d.gpa}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={styles.scrapedBox}>
              <div style={styles.profileHeader}>
                <div style={styles.blackText}>
                  <b>Full Name:</b> {student.fullName}
                </div>
                <div style={styles.blackText}>
                  <b>Academic Year:</b> {student.year}
                </div>
              </div>
              <div
                style={styles.htmlWrapper}
                dangerouslySetInnerHTML={{
                  __html:
                    cachedHtml[activeTab] ||
                    "Please wait, data is being cached...",
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  fullCenter: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    color: "#000",
    fontWeight: "bold",
  },
  authBg: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#000",
  },
  loginCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "8px",
    width: "350px",
    textAlign: "center",
  },
  blackText: { color: "#000000" },
  blackInput: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "2px solid #000",
    borderRadius: "4px",
    fontWeight: "bold",
    color: "#000",
  },
  blackBtn: {
    width: "100%",
    padding: "12px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  dashboard: { display: "flex", height: "100vh", background: "#fff" },
  sidebar: {
    width: "240px",
    background: "#000",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#3498db",
    borderBottom: "1px solid #222",
  },
  nav: { flex: 1, padding: "10px" },
  navGroup: {
    fontSize: "10px",
    color: "#666",
    textTransform: "uppercase",
    padding: "15px 10px 5px",
  },
  navBtn: {
    display: "block",
    width: "100%",
    padding: "12px",
    background: "none",
    border: "none",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    borderBottom: "1px solid #111",
  },
  progress: {
    padding: "10px",
    fontSize: "10px",
    textAlign: "center",
    background: "#111",
  },
  logoutBtn: {
    marginTop: "30px",
    width: "100%",
    padding: "10px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  topBar: {
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #000",
  },
  profileInfo: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#000",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  contentContainer: { padding: "30px" },
  scrapedBox: {
    border: "2px solid #000",
    borderRadius: "8px",
    padding: "20px",
  },
  profileHeader: {
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #000",
  },
  htmlWrapper: { color: "#000000", fontWeight: "600" },
  gpaContainer: { textAlign: "center" },
  gpaHero: {
    fontSize: "72px",
    fontWeight: "900",
    color: "#000",
    margin: "20px 0",
  },
  gpaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  gpaCard: { padding: "20px", border: "2px solid #000", borderRadius: "8px" },
};

export default App;
