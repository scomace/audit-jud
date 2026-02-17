import { useState, useEffect, useRef, useCallback } from "react";
import { sendIM } from "./api";

/* ─── RESPONSIVE HOOK ──────────────────────────────────────────────── */
function useLayout() {
  const [layout, setLayout] = useState(() => getLayout());
  function getLayout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isLandscape = w > h;
    if (w >= 900) return "desktop";
    if (isLandscape) return "landscape";
    return "portrait";
  }
  useEffect(() => {
    const onResize = () => setLayout(getLayout());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return layout;
}

/* ─── SVG ICONS ────────────────────────────────────────────────────── */
const FolderIcon = ({ color = "#F5C542" }) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%">
    <path d="M4 40V10a2 2 0 012-2h14l4 4h18a2 2 0 012 2v26a2 2 0 01-2 2H6a2 2 0 01-2-2z" fill={color} />
    <path d="M4 16h40v24a2 2 0 01-2 2H6a2 2 0 01-2-2V16z" fill={color} opacity="0.85" />
    <path d="M4 16h40" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
  </svg>
);

const ExcelIcon = () => (
  <svg viewBox="0 0 48 48" width="100%" height="100%">
    <rect x="6" y="4" width="36" height="40" rx="2" fill="#fff" stroke="#217346" strokeWidth="2" />
    <rect x="6" y="4" width="14" height="40" rx="2" fill="#217346" />
    <text x="13" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Segoe UI, sans-serif">X</text>
    <path d="M24 14h14M24 22h14M24 30h14M24 38h10" stroke="#217346" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 48 48" width="100%" height="100%">
    <rect x="2" y="8" width="44" height="32" rx="3" fill="#0078D4" />
    <path d="M2 12l22 15 22-15" stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
    <path d="M2 40l16-14M46 40l-16-14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
  </svg>
);

const IMIcon = () => (
  <svg viewBox="0 0 48 48" width="100%" height="100%">
    <rect x="4" y="4" width="40" height="32" rx="4" fill="#7B83EB" />
    <path d="M10 40l6-6h22" stroke="#7B83EB" strokeWidth="3" fill="#7B83EB" strokeLinejoin="round" />
    <circle cx="16" cy="20" r="2.5" fill="white" />
    <circle cx="24" cy="20" r="2.5" fill="white" />
    <circle cx="32" cy="20" r="2.5" fill="white" />
  </svg>
);



const WinIcon = () => (
  <svg viewBox="0 0 20 20" width="100%" height="100%">
    <path d="M1 3.5l7.5-1v7H1z" fill="white" />
    <path d="M9.5 2.3l9-1.3v8.5h-9z" fill="white" />
    <path d="M1 10.5h7.5v7L1 16.5z" fill="white" />
    <path d="M9.5 10.5h9V19l-9-1.3z" fill="white" />
  </svg>
);

/* ─── WINDOW COMPONENT ─────────────────────────────────────────────── */
function AppWindow({ title, children, onClose, zIndex, onFocus, accentColor = "#0078D4", layout }) {
  const isCompact = layout === "landscape";
  const isDesktop = layout === "desktop";
  const taskbarH = isCompact ? 34 : 42;

  return (
    <div onClick={onFocus} style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: taskbarH,
      display: "flex",
      alignItems: isDesktop ? "flex-start" : "center",
      justifyContent: "center",
      zIndex,
      padding: isDesktop ? "40px 20px 20px" : isCompact ? "4px" : "8px",
      animation: "winOpen 0.15s ease-out",
    }}>
      <div style={{
        width: isDesktop ? "60%" : "100%",
        maxWidth: isDesktop ? 680 : 500,
        maxHeight: "100%",
        background: "#fff",
        boxShadow: isDesktop
          ? "0 8px 40px rgba(0,0,0,0.35), 0 0 1px rgba(0,0,0,0.3)"
          : "0 2px 20px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        border: "1px solid #888",
      }}>
        {/* Title bar */}
        <div style={{
          height: isCompact ? 28 : 32, minHeight: isCompact ? 28 : 32,
          background: accentColor,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 2px 0 12px",
          userSelect: "none",
        }}>
          <span style={{
            color: "white", fontSize: isCompact ? 11 : 12, fontWeight: 400,
            fontFamily: '"Segoe UI", Tahoma, sans-serif',
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{title}</span>
          <div style={{ display: "flex", height: "100%" }}>
            {["─", "□", "✕"].map((sym, i) => (
              <button key={i}
                onClick={i === 2 ? (e) => { e.stopPropagation(); onClose(); } : undefined}
                style={{
                  background: "none", border: "none", color: "white",
                  width: isCompact ? 36 : 46, height: "100%",
                  cursor: i === 2 ? "pointer" : "default",
                  fontSize: i === 2 ? 14 : 11, fontWeight: 300,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: '"Segoe UI", sans-serif',
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = i === 2 ? "#E81123" : "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >{sym}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── SPREADSHEET DATA ─────────────────────────────────────────────── */

const AUDIT_CY = new Date().getFullYear() - 1;
const AUDIT_PY = new Date().getFullYear() - 2;

const COLUMNS = [
  { label: "Aging Bucket", width: "1.2fr", align: "left" },
  { label: "Balance", width: "1fr", align: "right" },
  { label: "Rate", width: "0.6fr", align: "right" },
  { label: "Reserve", width: "1fr", align: "right" },
];

const CY_DATA = {
  title: `Allowance for Doubtful Accounts — CY ${AUDIT_CY}`,
  subtitle: "Client: Sample Corp — Trade Receivables",
  rows: [
    { section: "A/R Aging Analysis" },
    { cells: ["Current", 425000, "1.0%", 4250] },
    { cells: ["31–60 days", 112000, "5.0%", 5600] },
    { cells: ["61–90 days", 48000, "15.0%", 7200] },
    { cells: ["91–120 days", 23000, "35.0%", 8050] },
    { cells: ["> 120 days", 14500, "75.0%", 10875] },
    { spacer: true },
    { cells: ["Total A/R", 622500, "", 35975], bold: true, topBorder: true },
  ],
  judgment: [
    { step: "Step 1: Clarify Issues & Objectives", content: null },
    { step: "Step 2: Consider Alternatives", content: null },
    { step: "Step 3: Gather & Evaluate Information", content: null },
    { step: "Step 4: Reach Conclusion", content: null },
    { step: "Step 5: Articulate & Document Rationale", content: null },
  ],
};

const PY_DATA = {
  title: `Allowance for Doubtful Accounts — PY ${AUDIT_PY}`,
  subtitle: "Client: Sample Corp — Trade Receivables",
  rows: [
    { section: "A/R Aging Analysis" },
    { cells: ["Current", 398000, "1.0%", 3980] },
    { cells: ["31–60 days", 95000, "5.0%", 4750] },
    { cells: ["61–90 days", 38000, "15.0%", 5700] },
    { cells: ["91–120 days", 19500, "35.0%", 6825] },
    { cells: ["> 120 days", 11200, "75.0%", 8400] },
    { spacer: true },
    { cells: ["Total A/R", 561700, "", 29655], bold: true, topBorder: true },
  ],
  judgment: [
    { step: "Step 1: Clarify Issues & Objectives", content: "To assess the existence and valuation of accounts receivable by analyzing the allowance for estimated credit losses. Specifically, evaluate whether management's reserve rates applied to each aging bucket are reasonable and whether the total recorded allowance is adequate." },
    { step: "Step 2: Consider Alternatives", content: "Considered three approaches: (1) Accept client's rates as consistent with prior year, (2) independently recalculate rates using historical write-off data from the past three years, or (3) benchmark against industry loss rates for similar-sized distributors. Elected to perform approach (2) and corroborate with (1)." },
    { step: "Step 3: Gather & Evaluate Information", content: `Obtained A/R aging subledger as of December 31, ${AUDIT_PY} and agreed to GL without exception. Obtained 3-year write-off history from client controller. Historical write-off rates by bucket: Current 0.8%, 31\u201360 days 4.2%, 61\u201390 days 13.1%, 91\u2013120 days 31.7%, >120 days 72.4%. Client's applied rates are slightly conservative relative to historical experience, which is appropriate given current economic conditions. No individually significant receivables identified requiring specific reserve.` },
    { step: "Step 4: Reach Conclusion", content: `The client's recorded allowance is reasonable. Applied rates are consistent with historical write-off experience and are appropriately conservative. The total calculated reserve of $29,655 is in line with management's recorded balance. No material misstatement identified. The allowance for doubtful accounts is fairly stated as of December 31, ${AUDIT_PY}.` },
    { step: "Step 5: Articulate & Document Rationale", content: `We conclude the allowance is reasonable based on: (a) rates are supported by 3-year historical write-off data, (b) rates are slightly conservative versus historical actuals, which is appropriate, (c) no concentration risk or individually significant past-due balances were identified, and (d) methodology is consistent with the prior year. No adjustment proposed. Workpaper reviewed and approved \u2014 S. Mitchell, Senior Manager.` },
  ],
};

function formatCurrency(val) {
  if (val === null || val === undefined || val === "") return "";
  if (typeof val === "string") return val;
  const neg = val < 0;
  const str = "$" + Math.abs(val).toLocaleString("en-US");
  return neg ? "(" + str + ")" : str;
}

/* ─── SPREADSHEET VIEWER ──────────────────────────────────────────── */
function SpreadsheetView({ data, layout }) {
  const isCompact = layout === "landscape";
  const f = '"Segoe UI", sans-serif';
  const mono = '"Consolas", "Courier New", monospace';
  const cellPad = isCompact ? "4px 5px" : "6px 8px";

  const rowNumStyle = {
    background: "#e8e8e8", borderRight: "1px solid #d0d0d0",
    borderBottom: "1px solid #d0d0d0",
    padding: "2px 0", fontSize: 9, color: "#888",
    textAlign: "center", width: 24, minWidth: 24, flexShrink: 0,
  };

  let rowNum = 0;

  const renderRow = (row, i) => {
    rowNum++;
    const rn = rowNum + 3;

    if (row.section) {
      return (
        <div key={i} style={{ display: "flex" }}>
          <div style={rowNumStyle}>{rn}</div>
          <div style={{
            flex: 1, padding: cellPad,
            fontWeight: 700, fontSize: isCompact ? 9 : 11,
            color: "#217346", background: "#edf7ed",
            borderBottom: "1px solid #d0d0d0",
          }}>{row.section}</div>
        </div>
      );
    }

    if (row.spacer) {
      return (
        <div key={i} style={{ display: "flex" }}>
          <div style={rowNumStyle}>{rn}</div>
          <div style={{ flex: 1, height: isCompact ? 4 : 6, borderBottom: "1px solid #eee" }} />
        </div>
      );
    }

    return (
      <div key={i} style={{ display: "flex" }}>
        <div style={rowNumStyle}>{rn}</div>
        <div style={{
          flex: 1, display: "grid",
          gridTemplateColumns: COLUMNS.map(c => c.width).join(" "),
          borderBottom: row.doubleBorder ? "3px double #333" : row.topBorder ? "1.5px solid #333" : "1px solid #eee",
          background: row.highlight ? "#fff8e1" : "white",
        }}>
          {row.cells.map((cell, ci) => (
            <div key={ci} style={{
              padding: cellPad,
              fontWeight: row.bold ? 700 : 400,
              fontSize: isCompact ? 9 : 11,
              textAlign: COLUMNS[ci]?.align || "left",
              fontFamily: COLUMNS[ci]?.align === "right" ? mono : f,
              color: (typeof cell === "number" && cell < 0) ? "#c00" : "#1a1a1a",
              borderRight: ci < COLUMNS.length - 1 ? "1px solid #eee" : "none",
            }}>{typeof cell === "number" ? formatCurrency(cell) : cell}</div>
          ))}
        </div>
      </div>
    );
  };

  rowNum = 0;

  return (
    <div style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Ribbon */}
      <div style={{
        background: "#217346", padding: isCompact ? "3px 10px" : "4px 12px",
        display: "flex", gap: 12, flexShrink: 0,
      }}>
        {["File", "Home", "Insert", "Page Layout", "Formulas"].map((t, ti) => (
          <span key={t} style={{
            color: ti === 1 ? "white" : "rgba(255,255,255,0.6)",
            fontSize: isCompact ? 8 : 10,
            borderBottom: ti === 1 ? "1px solid white" : "none",
            paddingBottom: 1,
          }}>{t}</span>
        ))}
      </div>
      {/* Formula bar */}
      <div style={{
        display: "flex", borderBottom: "1px solid #d4d4d4",
        background: "#f6f6f6", flexShrink: 0,
      }}>
        <div style={{
          width: 40, borderRight: "1px solid #d4d4d4",
          padding: "2px 4px", fontSize: 9, color: "#333",
          textAlign: "center", background: "#fff",
        }}>A1</div>
        <div style={{
          flex: 1, padding: "2px 6px", fontSize: 9,
          color: "#555", fontStyle: "italic",
        }}>{data.title}</div>
      </div>
      {/* Column letters */}
      <div style={{ display: "flex", background: "#f0f0f0", flexShrink: 0 }}>
        <div style={{
          width: 24, minWidth: 24, background: "#e8e8e8",
          borderRight: "1px solid #d0d0d0", borderBottom: "1px solid #d0d0d0",
          padding: "2px 0", fontSize: 8, color: "#888", textAlign: "center",
        }}></div>
        <div style={{
          flex: 1, display: "grid",
          gridTemplateColumns: COLUMNS.map(c => c.width).join(" "),
          borderBottom: "1px solid #d0d0d0",
        }}>
          {["A", "B", "C", "D"].map((l, li) => (
            <div key={l} style={{
              padding: "2px 4px", fontSize: 8, color: "#888",
              textAlign: "center",
              borderRight: li < 3 ? "1px solid #d0d0d0" : "none",
            }}>{l}</div>
          ))}
        </div>
      </div>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Title */}
        <div style={{ display: "flex" }}>
          <div style={rowNumStyle}>1</div>
          <div style={{
            flex: 1, padding: isCompact ? "4px 5px" : "5px 8px",
            fontWeight: 700, fontSize: isCompact ? 10 : 12,
            color: "#217346", background: "#f9fdf9",
            borderBottom: "1px solid #d0d0d0",
          }}>{data.title}</div>
        </div>
        {/* Subtitle */}
        <div style={{ display: "flex" }}>
          <div style={rowNumStyle}>2</div>
          <div style={{
            flex: 1, padding: isCompact ? "3px 5px" : "3px 8px",
            fontSize: isCompact ? 8 : 10, color: "#888",
            fontStyle: "italic", borderBottom: "1px solid #d0d0d0",
          }}>{data.subtitle}</div>
        </div>
        {/* Column headers */}
        <div style={{ display: "flex" }}>
          <div style={{ ...rowNumStyle, borderBottom: "2px solid #217346" }}>3</div>
          <div style={{
            flex: 1, display: "grid",
            gridTemplateColumns: COLUMNS.map(c => c.width).join(" "),
            background: "#f5f5f5", borderBottom: "2px solid #217346",
          }}>
            {COLUMNS.map((col, ci) => (
              <div key={ci} style={{
                padding: isCompact ? "4px 5px" : "5px 8px",
                fontWeight: 700, fontSize: isCompact ? 9 : 11,
                textAlign: col.align || "left",
                borderRight: ci < COLUMNS.length - 1 ? "1px solid #d0d0d0" : "none",
              }}>{col.label}</div>
            ))}
          </div>
        </div>
        {/* Data rows */}
        {data.rows.map((row, i) => renderRow(row, i))}
        {/* Empty rows */}
        {[...Array(2)].map((_, i) => {
          rowNum++;
          return (
            <div key={"e" + i} style={{ display: "flex" }}>
              <div style={rowNumStyle}>{rowNum + 3}</div>
              <div style={{ flex: 1, height: isCompact ? 16 : 20, borderBottom: "1px solid #eee" }} />
            </div>
          );
        })}

        {/* KPMG Professional Judgment Framework */}
        <div style={{ borderTop: "3px solid #00338D", background: "#f0f3f8" }}>
          <div style={{
            background: "#00338D", padding: isCompact ? "6px 10px" : "8px 12px",
          }}>
            <div style={{
              color: "white", fontSize: isCompact ? 10 : 12,
              fontWeight: 700, fontFamily: f, letterSpacing: 0.5,
            }}>KPMG Professional Judgment Framework</div>
          </div>
          <div style={{
            padding: isCompact ? "4px 10px" : "5px 12px",
            background: "#e8edf4", borderBottom: "1px solid #c8d0dc",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#00338D", flexShrink: 0,
            }} />
            <span style={{
              fontSize: isCompact ? 8 : 9, color: "#555",
              fontStyle: "italic", fontFamily: f,
            }}>Internal audit documentation — not prepared by client</span>
          </div>
          {data.judgment.map((item, ji) => (
            <div key={ji} style={{ borderBottom: "1px solid #d0d6e0" }}>
              <div style={{
                padding: isCompact ? "6px 10px" : "8px 12px",
                background: ji % 2 === 0 ? "#e2e8f0" : "#dce3ed",
                fontWeight: 700, fontSize: isCompact ? 9 : 11,
                color: "#00338D", fontFamily: f,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{
                  background: "#00338D", color: "white",
                  width: isCompact ? 16 : 18, height: isCompact ? 16 : 18,
                  borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: isCompact ? 8 : 9, fontWeight: 700, flexShrink: 0,
                }}>{ji + 1}</span>
                {item.step}
              </div>
              {item.content ? (
                <div style={{
                  padding: isCompact ? "6px 10px 8px 32px" : "8px 12px 10px 36px",
                  background: "white",
                }}>
                  <div style={{
                    fontSize: isCompact ? 9 : 11,
                    color: "#333", lineHeight: 1.6, fontFamily: f,
                  }}>{item.content}</div>
                </div>
              ) : (
                <div
                  style={{
                    padding: isCompact ? "10px 10px 10px 32px" : "12px 12px 12px 36px",
                    background: "white", cursor: "text",
                    minHeight: isCompact ? 48 : 56,
                    borderLeft: "3px solid #0078D4",
                    marginLeft: isCompact ? 10 : 12,
                    marginRight: isCompact ? 10 : 12,
                    marginTop: 4, marginBottom: 4,
                    borderRadius: 2, position: "relative",
                    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "inset 0 1px 6px rgba(0,120,212,0.12)";
                    e.currentTarget.style.borderLeftColor = "#005a9e";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderLeftColor = "#0078D4";
                  }}
                >
                  <div style={{
                    fontSize: isCompact ? 9 : 11, color: "#aaa",
                    fontStyle: "italic", fontFamily: f,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                      <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" stroke="#0078D4" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    Click here to enter your response...
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Sheet tabs */}
      <div style={{
        borderTop: "1px solid #d4d4d4", background: "#e8e8e8",
        padding: "0 6px", display: "flex", alignItems: "center",
        height: isCompact ? 18 : 22, flexShrink: 0,
      }}>
        <div style={{
          background: "white", border: "1px solid #d0d0d0", borderBottom: "none",
          padding: "1px 8px", fontSize: 8, color: "#217346", fontWeight: 600,
        }}>Allowance</div>
        <div style={{
          background: "#e0e0e0", border: "1px solid #d0d0d0", borderBottom: "none",
          padding: "1px 8px", fontSize: 8, color: "#888", marginLeft: 2,
        }}>Support</div>
      </div>
    </div>
  );
}

/* ─── FOLDER WINDOW ────────────────────────────────────────────────── */
function FolderWindow({ title, fileName, spreadsheetData, onClose, zIndex, onFocus, layout }) {
  const isCompact = layout === "landscape";
  const [fileOpen, setFileOpen] = useState(false);

  if (fileOpen) {
    return (
      <AppWindow title={fileName + " — Excel"} onClose={() => setFileOpen(false)} zIndex={zIndex} onFocus={onFocus} accentColor="#217346" layout={layout}>
        <SpreadsheetView data={spreadsheetData} layout={layout} />
      </AppWindow>
    );
  }

  return (
    <AppWindow title={title} onClose={onClose} zIndex={zIndex} onFocus={onFocus} accentColor="#0078D4" layout={layout}>
      <div style={{
        borderBottom: "1px solid #e0e0e0", padding: isCompact ? "4px 12px" : "6px 12px",
        display: "flex", alignItems: "center", gap: 8,
        background: "#f9f9f9", fontSize: 12, color: "#666",
        fontFamily: '"Segoe UI", sans-serif',
      }}>
        <span style={{ fontSize: 11, color: "#0078D4", cursor: "pointer" }}>Home</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ fontSize: 11 }}>Share</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ fontSize: 11 }}>View</span>
      </div>
      <div style={{
        borderBottom: "1px solid #e0e0e0", padding: isCompact ? "4px 12px" : "6px 12px",
        display: "flex", alignItems: "center", gap: 8, background: "#fff",
      }}>
        <div style={{
          flex: 1, background: "#f5f5f5", border: "1px solid #ddd",
          padding: "4px 8px", fontSize: 12,
          fontFamily: '"Segoe UI", sans-serif', color: "#333",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 14 }}>📁</span>
          <span>Desktop &gt; {title}</span>
        </div>
      </div>
      <div style={{ padding: isCompact ? "8px 14px" : "16px 20px", background: "white" }}>
        <div
          onClick={() => setFileOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 2,
            cursor: "pointer", border: "1px solid transparent",
            transition: "all 0.1s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e5f3ff"; e.currentTarget.style.border = "1px solid #cce4f7"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <div style={{ width: 36, height: 36, flexShrink: 0 }}><ExcelIcon /></div>
          <div>
            <div style={{ fontSize: 13, fontFamily: '"Segoe UI", sans-serif', color: "#1a1a1a" }}>{fileName}</div>
            <div style={{ fontSize: 11, color: "#888", fontFamily: '"Segoe UI", sans-serif', marginTop: 2 }}>
              Microsoft Excel Worksheet · 247 KB
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/* ─── EMAIL COMPOSE WINDOW ─────────────────────────────────────────── */
function EmailWindow({ onClose, zIndex, onFocus, layout }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const isCompact = layout === "landscape";

  const fieldStyle = {
    width: "100%", border: "none", borderBottom: "1px solid #e8e8e8",
    padding: isCompact ? "6px 14px" : "10px 14px",
    fontSize: 16, fontFamily: '"Segoe UI", sans-serif',
    outline: "none", background: "transparent", boxSizing: "border-box",
  };

  return (
    <AppWindow title="Outlook — New Message" onClose={onClose} zIndex={zIndex} onFocus={onFocus} accentColor="#0078D4" layout={layout}>
      <div style={{
        padding: isCompact ? "4px 14px" : "8px 14px",
        borderBottom: "1px solid #e8e8e8",
        display: "flex", gap: 6, background: "#f9f9f9",
      }}>
        <button style={{
          background: "#0078D4", color: "white", border: "none",
          padding: "5px 18px", fontSize: 12, cursor: "pointer",
          fontFamily: '"Segoe UI", sans-serif', fontWeight: 600,
        }}>Send</button>
        <button style={{
          background: "transparent", color: "#555", border: "1px solid #ccc",
          padding: "5px 12px", fontSize: 12, cursor: "pointer",
          fontFamily: '"Segoe UI", sans-serif',
        }}>Attach</button>
        <button style={{
          background: "transparent", color: "#555", border: "1px solid #ccc",
          padding: "5px 12px", fontSize: 12, cursor: "pointer",
          fontFamily: '"Segoe UI", sans-serif',
        }}>Discard</button>
      </div>
      <input placeholder="To: client@samplecorp.com" value={to} onChange={e => setTo(e.target.value)} style={fieldStyle} />
      <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} style={fieldStyle} />
      <textarea
        placeholder="Compose your message..."
        value={body} onChange={e => setBody(e.target.value)}
        style={{
          ...fieldStyle, flex: 1, minHeight: isCompact ? 60 : 160,
          resize: "none", borderBottom: "none", padding: 14,
        }}
      />
    </AppWindow>
  );
}

/* ─── IM WINDOW ────────────────────────────────────────────────────── */
function IMWindow({ onClose, zIndex, onFocus, layout, onTimeExtended }) {
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const isCompact = layout === "landscape";

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

   // Intro: manager starts typing, then sends kickoff message (runs on IM mount)
  useEffect(() => {
    // Show typing bubble briefly
    setTyping(true);

    const t = setTimeout(() => {
      setMessages(prev => {
        // Safety guard: don't duplicate if something already inserted
        if (prev.length) return prev;

        return [
          ...prev,
          {
            from: "manager",
            text:
              "hey I need you to get started on the allowance for ecl asap. get this year's calc from the client and document our 5 professional judgment steps on it",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ];
      });

      setTyping(false);
    }, 1100); // tweak duration if you want it shorter/longer

    return () => clearTimeout(t);
  }, []);

  const send = async () => {
    if (!msg.trim() || typing || blocked) return;
    const userMsg = { from: "you", text: msg.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setMsg("");
    setTyping(true);

    try {
      const { reply, flagged } = await sendIM(updated);
      const newCount = flagged ? flagCount + 1 : flagCount;
      setFlagCount(newCount);

      if (newCount >= 3) {
        setMessages(prev => [...prev, {
          from: "manager",
          text: "i'm blocking you, bye",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
        setBlocked(true);
      } else {
        setMessages(prev => [...prev, {
          from: "manager",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
        if (reply.trim().toLowerCase() === "k" && onTimeExtended) {
          onTimeExtended();
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        from: "manager",
        text: "sorry connection dropped, msg me again",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setTyping(false);
    }
  };

  const disabled = typing || blocked;

  return (
    <AppWindow title="Teams Messenger" onClose={onClose} zIndex={zIndex} onFocus={onFocus} accentColor="#7B83EB" layout={layout}>
      <div style={{
        padding: isCompact ? "6px 14px" : "10px 14px",
        borderBottom: "1px solid #e8e8e8",
        display: "flex", alignItems: "center", gap: 10, background: "#f9f9f9",
      }}>
        <div style={{
          width: isCompact ? 26 : 32, height: isCompact ? 26 : 32,
          borderRadius: "50%", background: "#7B83EB",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: isCompact ? 11 : 14, fontWeight: 600,
          fontFamily: '"Segoe UI", sans-serif', flexShrink: 0,
        }}>SM</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: '"Segoe UI", sans-serif' }}>Sarah Mitchell</div>
          <div style={{ fontSize: 11, color: blocked ? "#E8453C" : "#4CAF50", fontFamily: '"Segoe UI", sans-serif' }}>
            {blocked ? "● Blocked" : "● Online — Senior Manager"}
          </div>
        </div>
      </div>
      <div ref={chatRef} style={{
        flex: 1, padding: "8px 14px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 8,
        background: "#fff",
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === "you" ? "flex-end" : "flex-start",
            maxWidth: "80%",
          }}>
            <div style={{
              background: m.from === "you" ? "#7B83EB" : "#f0f0f0",
              color: m.from === "you" ? "white" : "#1a1a1a",
              padding: "8px 12px", borderRadius: m.from === "you" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              fontSize: 13, fontFamily: '"Segoe UI", sans-serif', lineHeight: 1.4,
            }}>{m.text}</div>
            <div style={{
              fontSize: 10, color: "#999", marginTop: 2,
              textAlign: m.from === "you" ? "right" : "left",
              fontFamily: '"Segoe UI", sans-serif',
            }}>{m.time}</div>
          </div>
        ))}
        {typing && (
          <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
            <div style={{
              background: "#f0f0f0", padding: "8px 14px",
              borderRadius: "14px 14px 14px 4px",
              fontSize: 13, fontFamily: '"Segoe UI", sans-serif',
              color: "#999",
            }}>
              <span style={{ animation: "typingDots 1.2s infinite" }}>●</span>
              {" "}
              <span style={{ animation: "typingDots 1.2s infinite 0.2s" }}>●</span>
              {" "}
              <span style={{ animation: "typingDots 1.2s infinite 0.4s" }}>●</span>
            </div>
          </div>
        )}
      </div>
      {blocked ? (
        <div style={{
          padding: "12px 14px", borderTop: "1px solid #e8e8e8",
          background: "#f9f9f9", textAlign: "center",
          fontSize: 12, color: "#999", fontFamily: '"Segoe UI", sans-serif',
        }}>
          Sarah Mitchell has blocked you
        </div>
      ) : (
        <div style={{
          padding: isCompact ? "4px 10px" : "8px 10px",
          borderTop: "1px solid #e8e8e8",
          display: "flex", gap: 8, background: "#f9f9f9",
        }}>
          <input
            value={msg} onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message..."
            disabled={disabled}
            style={{
              flex: 1, border: "1px solid #ddd", borderRadius: 4,
              padding: "8px 12px", fontSize: 16, outline: "none",
              fontFamily: '"Segoe UI", sans-serif',
              opacity: disabled ? 0.6 : 1,
            }}
          />
          <button onClick={send} disabled={disabled} style={{
            background: disabled ? "#aaa" : "#7B83EB", color: "white", border: "none",
            borderRadius: 4, padding: "8px 16px", cursor: disabled ? "default" : "pointer",
            fontFamily: '"Segoe UI", sans-serif', fontSize: 13, fontWeight: 600,
          }}>Send</button>
        </div>
      )}
    </AppWindow>
  );
}



/* ═══════════════════════════════════════════════════════════════════
   MAIN DESKTOP
   ═══════════════════════════════════════════════════════════════════ */
const DESKTOP_ITEMS = [
  { id: "cy-folder", label: "Current Year Audit\nWorking Papers", type: "folder-cy" },
  { id: "py-folder", label: "Prior Year Audit\nWorking Papers", type: "folder-py" },
  { id: "email", label: "Outlook", type: "email" },
  { id: "im", label: "Teams\nMessaging", type: "im" },
];

function getIcon(type, size) {
  const s = { width: size, height: size };
  return (
    <div style={s}>
      {type === "folder-cy" && <FolderIcon />}
      {type === "folder-py" && <FolderIcon color="#BDB76B" />}
      {type === "email" && <EmailIcon />}
      {type === "im" && <IMIcon />}
    </div>
  );
}

export default function AuditDesktop() {
  const layout = useLayout();
  const [openWindows, setOpenWindows] = useState([]);
  const [topZ, setTopZ] = useState(10);
  const [windowZ, setWindowZ] = useState({});
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [notifPulse, setNotifPulse] = useState(true);

  const isCompact = layout === "landscape";
  const isDesktop = layout === "desktop";
  const taskbarH = isCompact ? 34 : 42;
  const iconSize = isCompact ? 34 : isDesktop ? 48 : 44;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

const openApp = useCallback((id) => {
  setOpenWindows(prev => prev.includes(id) ? prev : [...prev, id]);
  if (id === "email") setNotifPulse(false);
  setTopZ(z => {
    setWindowZ(prev => ({ ...prev, [id]: z + 1 }));
    return z + 1;
  });
  setStartOpen(false);
}, []);

  // Auto-open IM on initial load (plays the existing winOpen animation)
  useEffect(() => {
    openApp("im");
  }, [openApp]);

  const closeApp = useCallback((id) => {
    setOpenWindows(prev => prev.filter(w => w !== id));
  }, []);

  const focusApp = useCallback((id) => {
    setTopZ(z => {
      setWindowZ(prev => ({ ...prev, [id]: z + 1 }));
      return z + 1;
    });
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formattedDate = time.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" });

  // Countdown timer — 1 minute 5 seconds
  const TIMER_DURATION = 65;
  const [countdown, setCountdown] = useState(TIMER_DURATION);
  const [pulseKey, setPulseKey] = useState(1); // changing key forces remount = animation restart
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  // Pulse at start, 30s/0s marks, and last 10 seconds
  useEffect(() => {
    const secsInMinute = countdown % 60;
    const isLast10 = countdown <= 10 && countdown > 0;
    const isHalfMinute = secsInMinute === 30 && countdown < TIMER_DURATION;
    const isMinuteMark = secsInMinute === 0 && countdown > 0 && countdown < TIMER_DURATION;

    if (isLast10 || isHalfMinute || isMinuteMark) {
      setPulseKey(k => k + 1);
    }
  }, [countdown]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const countdownStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const timerColor = countdown <= 10 ? "#FF4444" : countdown <= 30 ? "#FFB020" : "#4EC94E";
  const timerDone = countdown === 0;
    const [showPill, setShowPill] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const extendTimer = useCallback(() => {
      setCountdown(prev => {
        if (prev <= 0) return prev;
        setShowPill(true);
        setShowDialog(true);
        setPulseKey(k => k + 1);
        setTimeout(() => setShowPill(false), 2200);
        return prev + 600;
      });
    }, []);
  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      display: "flex", flexDirection: "column",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      position: "relative",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { touch-action: manipulation; overflow: hidden; height: 100%; width: 100%; }
        input, textarea, select { font-size: 16px !important; touch-action: manipulation; }
        @keyframes notifBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        @keyframes notifGlow {
          0%, 100% { box-shadow: 0 0 4px rgba(232,69,60,0.4); }
          50% { box-shadow: 0 0 16px rgba(232,69,60,0.8); }
        }
        @keyframes startSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes winOpen {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes timerPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(78, 201, 78, 0.5); }
          40% { transform: scale(1.15); box-shadow: 0 0 16px 4px rgba(78, 201, 78, 0.4); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(78, 201, 78, 0); }
        }
        @keyframes typingDots {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pillPop {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.8); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          75% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes dialogPop {
          from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>

      {/* ─── WALLPAPER ─── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #1B2838 0%, #1565C0 35%, #0078D4 55%, #00A4EF 80%, #68D8FF 100%)",
      }}>
        <div style={{
          position: "absolute", width: "200%", height: "200%",
          top: "-60%", left: "-30%",
          background: "radial-gradient(ellipse at 40% 50%, rgba(255,255,255,0.07) 0%, transparent 60%)",
          transform: "rotate(-15deg)",
        }} />
        <div style={{
          position: "absolute", bottom: taskbarH + 10, right: 20, opacity: 0.04,
          width: isDesktop ? 240 : 140, height: isDesktop ? 240 : 140,
        }}>
          <svg viewBox="0 0 88 88" fill="white" width="100%" height="100%">
            <path d="M0 12.4L35.7 7.6V42.3H0zM39.7 7L87.4 0V42.3H39.7zM0 45.7H35.7V80.5L0 75.6zM39.7 45.7H87.4V88L39.7 81z"/>
          </svg>
        </div>
      </div>

      {/* ─── DESKTOP ICON AREA ─── */}
      <div style={{
        flex: 1, position: "relative", zIndex: 1,
        padding: isCompact ? "8px 10px" : isDesktop ? "20px 24px" : "16px 12px",
        display: "flex",
        flexDirection: isCompact ? "row" : "column",
        flexWrap: "wrap",
        gap: isCompact ? 2 : 4,
        alignContent: "flex-start",
        alignItems: isCompact ? "flex-start" : undefined,
      }}>
        {DESKTOP_ITEMS.map((item) => (
          <button key={item.id}
            onClick={() => openApp(item.id)}
            style={{
              background: "transparent", border: "2px solid transparent",
              borderRadius: 2, cursor: "pointer",
              width: isCompact ? 76 : isDesktop ? 90 : 82,
              padding: isCompact ? "6px 4px" : "8px 4px",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: isCompact ? 2 : 4, position: "relative",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width: iconSize, height: iconSize, position: "relative" }}>
              {getIcon(item.type, iconSize)}
              {item.id === "email" && notifPulse && (
            <div style={{
              position: "absolute", top: -4, right: -4,
              width: 18, height: 18, borderRadius: "50%",
              background: "#E8453C", border: "2px solid rgba(255,255,255,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 9, fontWeight: 700,
              animation: "notifBounce 2s infinite, notifGlow 2s infinite",
            }}>!</div>
          )}

            </div>
            <span style={{
              color: "white", fontSize: isCompact ? 10 : 11, textAlign: "center",
              lineHeight: 1.25, fontWeight: 400,
              textShadow: "0 1px 3px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.3)",
              whiteSpace: "pre-line", wordBreak: "break-word",
              fontFamily: '"Segoe UI", sans-serif',
            }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ─── APP WINDOWS ─── */}
      {openWindows.includes("cy-folder") && (
        <FolderWindow title="Current Year Audit Working Papers" fileName={`CY ${AUDIT_CY} Allowance for Doubtful Accounts.xlsx`}

          spreadsheetData={CY_DATA}
          onClose={() => closeApp("cy-folder")} zIndex={windowZ["cy-folder"] || 10}
          onFocus={() => focusApp("cy-folder")} layout={layout} />
      )}
      {openWindows.includes("py-folder") && (
        <FolderWindow title="Prior Year Audit Working Papers" fileName={`PY ${AUDIT_PY} Allowance for Doubtful Accounts.xlsx`}
          spreadsheetData={PY_DATA}
          onClose={() => closeApp("py-folder")} zIndex={windowZ["py-folder"] || 10}
          onFocus={() => focusApp("py-folder")} layout={layout} />
      )}
      {openWindows.includes("email") && (
        <EmailWindow onClose={() => closeApp("email")} zIndex={windowZ["email"] || 10}
          onFocus={() => focusApp("email")} layout={layout} />
      )}
      {openWindows.includes("im") && (
        <IMWindow onClose={() => closeApp("im")} zIndex={windowZ["im"] || 10}
          onFocus={() => focusApp("im")} layout={layout} onTimeExtended={extendTimer} />
      )}


      {/* ─── START MENU ─── */}
      {startOpen && (
        <>
          <div onClick={() => setStartOpen(false)} style={{ position: "absolute", inset: 0, zIndex: 999 }} />
          <div style={{
            position: "absolute", bottom: taskbarH, left: 0,
            width: isDesktop ? 360 : "min(320px, 85vw)",
            maxHeight: `calc(100vh - ${taskbarH + 8}px)`,
            background: "#2B2B2B", zIndex: 1000,
            display: "flex", flexDirection: "column",
            boxShadow: "4px 0 20px rgba(0,0,0,0.4)",
            animation: "startSlide 0.15s ease-out",
            overflow: "hidden",
          }}>
            <div style={{
              padding: isCompact ? "10px 16px" : "20px 18px",
              borderBottom: "1px solid #3a3a3a",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: isCompact ? 30 : 40, height: isCompact ? 30 : 40,
                borderRadius: "50%", background: "#0078D4",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: isCompact ? 13 : 18, fontWeight: 600, flexShrink: 0,
              }}>A</div>
              <div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 500 }}>Audit Staff</div>
                <div style={{ color: "#999", fontSize: 12 }}>staff@auditfirm.com</div>
              </div>
            </div>
            <div style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
              {DESKTOP_ITEMS.map(item => (
                <button key={item.id} onClick={() => openApp(item.id)} style={{
                  width: "100%", background: "none", border: "none",
                  padding: isCompact ? "7px 16px" : "10px 18px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                  color: "white", textAlign: "left", transition: "background 0.1s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#3a3a3a"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  {getIcon(item.type, 24)}
                  <span style={{ fontSize: 13, fontFamily: '"Segoe UI", sans-serif' }}>
                    {item.label.replace(/\n/g, " ")}
                  </span>
                </button>
              ))}
            </div>
            <div style={{
              padding: "10px 18px", borderTop: "1px solid #3a3a3a",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ color: "#999", fontSize: 18 }}>⏻</span>
              <span style={{ color: "#999", fontSize: 13 }}>Power</span>
            </div>
          </div>
        </>
      )}

      {/* ─── TASKBAR ─── */}
      <div style={{
        height: taskbarH, background: "#1a1a1a",
        borderTop: "1px solid #333",
        display: "flex", alignItems: "center",
        position: "relative", zIndex: 1001,
        padding: "0 4px",
      }}>
        {/* Start button */}
        <button onClick={() => setStartOpen(prev => !prev)} style={{
          width: isCompact ? 38 : 46, height: "100%",
          background: startOpen ? "#333" : "transparent",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.1s",
        }}
          onMouseEnter={e => { if (!startOpen) e.currentTarget.style.background = "#2a2a2a"; }}
          onMouseLeave={e => { if (!startOpen) e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{ width: 18, height: 18 }}><WinIcon /></div>
        </button>

        {/* Open app indicators */}
        <div style={{
          display: "flex", height: "100%",
          marginLeft: 4, gap: 1, overflow: "hidden",
        }}>
          {openWindows.map(id => {
            const item = DESKTOP_ITEMS.find(d => d.id === id);
            return (
              <button key={id} onClick={() => focusApp(id)} style={{
                height: "100%", background: "#2a2a2a",
                border: "none", borderBottom: "2px solid #0078D4",
                cursor: "pointer", padding: isCompact ? "0 6px" : "0 10px",
                display: "flex", alignItems: "center", gap: 6,
                maxWidth: isDesktop ? 200 : isCompact ? 42 : 160, minWidth: 0,
              }}>
                {getIcon(item.type, 16)}
                {!isCompact && (
                  <span style={{
                    color: "white", fontSize: 11, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{item.label.replace(/\n/g, " ")}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Centered spacer */}
        <div style={{ flex: 1 }} />

        {/* Countdown timer — centered */}
        <div
          key={pulseKey}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: timerDone ? "rgba(255,68,68,0.15)" : "rgba(255,255,255,0.06)",
            borderRadius: 3,
            padding: isCompact ? "3px 10px" : "4px 14px",
            border: `1px solid ${timerColor}44`,
            color: timerColor,
            animation: "timerPulse 0.7s ease-out",
            transition: "background 0.3s, border-color 0.3s",
          }}
        >
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: timerColor,
            boxShadow: `0 0 6px ${timerColor}`,
          }} />
          <span style={{
            fontSize: isCompact ? 13 : 15,
            fontFamily: '"Consolas", "Courier New", monospace',
            fontWeight: 700, letterSpacing: 1.5,
          }}>{timerDone ? "TIME" : countdownStr}</span>
        </div>

        {/* Centered spacer */}
        <div style={{ flex: 1 }} />

        {/* Clock */}
        <div style={{
          height: "100%", display: "flex", alignItems: "center",
          padding: isCompact ? "0 8px" : "0 12px",
          borderLeft: "1px solid #333",
        }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#ccc", fontSize: 11, lineHeight: 1.3 }}>{formattedTime}</div>
            <div style={{ color: "#999", fontSize: 10, lineHeight: 1.3 }}>{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Minimal Pill notification */}
      {showPill && (
        <div style={{
          position: "absolute", bottom: 52, left: "50%",
          transform: "translateX(-50%)",
          background: "#4EC94E", color: "#000",
          padding: "6px 18px", borderRadius: 20,
          fontSize: 13, fontWeight: 700,
          fontFamily: '"Segoe UI", sans-serif',
          boxShadow: "0 2px 12px rgba(78, 201, 78, 0.4)",
          animation: "pillPop 2s ease-out forwards",
          zIndex: 9999,
        }}>
          ⏱ +10 min approved
        </div>
      )}

      {/* Dialog Box notification */}
      {showDialog && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 9998 }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(340px, 85vw)", background: "#f0f0f0", zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontFamily: '"Segoe UI", sans-serif',
            border: "1px solid #888",
            animation: "dialogPop 0.2s ease-out",
          }}>
            <div style={{
              background: "#0078D4", padding: "8px 12px",
              color: "white", fontSize: 12, fontWeight: 400,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>Timer</span>
              <button onClick={() => setShowDialog(false)} style={{
                background: "none", border: "none", color: "white",
                fontSize: 14, cursor: "pointer",
              }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ fontSize: 32, lineHeight: 1 }}>✅</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>Time Added to Budget!</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>Your manager has approved an additional 10 minutes. The countdown timer has been updated.</div>
              </div>
            </div>
            <div style={{ padding: "8px 24px 16px", textAlign: "right" }}>
              <button onClick={() => setShowDialog(false)} style={{
                background: "#e1e1e1", border: "1px solid #adadad",
                padding: "6px 32px", fontSize: 13, cursor: "pointer",
                fontFamily: '"Segoe UI", sans-serif',
              }}>OK</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}