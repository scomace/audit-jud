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

const DocIcon = () => (
  <svg viewBox="0 0 48 48" width="100%" height="100%">
    <path d="M10 4h20l10 10v30a2 2 0 01-2 2H10a2 2 0 01-2-2V6a2 2 0 012-2z" fill="#E8453C" />
    <path d="M30 4v10h10" fill="#C23127" />
    <path d="M16 24h16M16 30h16M16 36h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="24" cy="17" r="5" fill="none" stroke="white" strokeWidth="1.5" />
    <path d="M22 17l1.5 2 3-3.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
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

const CY_ROWS = [
  { section: "Projected Net Income" },
  { label: "2023 (Actual)", value: 500000 },
  { label: "2024 (Actual)", value: 550000 },
  { label: "2025 (Actual)", value: 605000 },
  { label: "2026 (Projected)", value: 665500 },
  { label: "2027 (Projected)", value: 732050 },
  { spacer: true },
  { section: "Fair Value Estimate" },
  { label: "Terminal Growth Rate", text: "3.0%" },
  { label: "Discount Rate (WACC)", text: "12.0%" },
  { label: "Capitalization Rate", text: "9.0%" },
  { label: "Normalized Earnings", value: 665500 },
  { label: "Fair Value (Income)", value: 7394444, bold: true, topBorder: true },
  { spacer: true },
  { section: "Impairment Test" },
  { label: "Net Assets (excl. GW)", value: 4250000 },
  { label: "Goodwill", value: 1800000 },
  { label: "Carrying Amount", value: 6050000, bold: true, topBorder: true },
  { spacer: true },
  { label: "Fair Value", value: 7394444 },
  { label: "Less: Carrying Amt", value: -6050000 },
  { label: "Excess / (Deficiency)", value: 1344444, bold: true, topBorder: true },
  { spacer: true },
  { label: "Impairment Loss", value: 0, bold: true, highlight: true },
  { label: "Revised Goodwill", value: 1800000, bold: true, doubleBorder: true },
  { spacer: true },
  { section: "Key Assumptions" },
  { assumption: "Revenue growth of 10% per year based on 3-year historical trend." },
  { assumption: "Discount rate of 12% reflects company-specific risk and current market rates." },
  { assumption: "Terminal growth rate of 3% aligned with long-term GDP forecast." },
  { assumption: "Normalized earnings based on 2026 projected net income." },
];

const PY_ROWS = [
  { section: "Projected Net Income" },
  { label: "2022 (Actual)", value: 413000 },
  { label: "2023 (Actual)", value: 500000,
    note: "Verified to GL \u2014 no exceptions noted." },
  { label: "2024 (Projected)", value: 550000 },
  { label: "2025 (Projected)", value: 605000 },
  { label: "2026 (Projected)", value: 665500,
    note: "10% annual increase appears reasonable based on 2022\u20132023 actual growth of ~21%." },
  { spacer: true },
  { section: "Fair Value Estimate" },
  { label: "Terminal Growth Rate", text: "3.0%" },
  { label: "Discount Rate (WACC)", text: "12.0%",
    note: "WACC recalculated \u2014 consistent with comparable public companies." },
  { label: "Capitalization Rate", text: "9.0%" },
  { label: "Normalized Earnings", value: 550000 },
  { label: "Fair Value (Income)", value: 6111111, bold: true, topBorder: true },
  { spacer: true },
  { section: "Impairment Test" },
  { label: "Net Assets (excl. GW)", value: 4100000 },
  { label: "Goodwill", value: 1800000 },
  { label: "Carrying Amount", value: 5900000, bold: true, topBorder: true },
  { spacer: true },
  { label: "Fair Value", value: 6111111 },
  { label: "Less: Carrying Amt", value: -5900000 },
  { label: "Excess / (Deficiency)", value: 211111, bold: true, topBorder: true,
    note: "Sufficient cushion \u2014 no impairment." },
  { spacer: true },
  { label: "Impairment Loss", value: 0, bold: true, highlight: true },
  { label: "Revised Goodwill", value: 1800000, bold: true, doubleBorder: true,
    note: "No adjustment required. Workpaper complete." },
  { spacer: true },
  { section: "Key Assumptions" },
  { assumption: "Revenue growth of 10% per year based on historical trend." },
  { assumption: "Discount rate of 12% reflects company-specific risk and current market rates." },
  { assumption: "Terminal growth rate of 3% aligned with long-term GDP forecast." },
  { assumption: "Normalized earnings based on 2024 projected net income.",
    note: "Assumptions reviewed and approved \u2014 S. Mitchell, Senior Manager." },
];

const CY_DATA = { title: "Goodwill Impairment \u2014 CY 2025", rows: CY_ROWS };
const PY_DATA = { title: "Goodwill Impairment \u2014 PY 2024", rows: PY_ROWS };


function formatCurrency(val) {
  if (val === null || val === undefined) return "";
  const neg = val < 0;
  const str = "$" + Math.abs(val).toLocaleString("en-US");
  return neg ? "(" + str + ")" : str;
}

/* ─── SPREADSHEET VIEWER ──────────────────────────────────────────── */
function SpreadsheetView({ data, layout }) {
  const isCompact = layout === "landscape";
  const f = '"Segoe UI", sans-serif';
  const fs = isCompact ? 10 : 12;
  const cellPad = isCompact ? "4px 6px" : "6px 8px";
  const spacerPad = isCompact ? "2px 6px" : "3px 8px";

  const rowNumStyle = {
    background: "#e8e8e8", border: "1px solid #d0d0d0",
    padding: "3px 0", fontSize: 10, color: "#888",
    textAlign: "center", width: 28, minWidth: 28,
  };

  let rowCounter = 0;

  const renderRow = (row, i) => {
    rowCounter++;
    const rn = rowCounter + 3;

    // Section header
    if (row.section) {
      return (
        <tr key={i}>
          <td style={rowNumStyle}>{rn}</td>
          <td colSpan={2} style={{
            border: "1px solid #d0d0d0", padding: cellPad,
            fontWeight: 700, fontSize: isCompact ? 10 : 12,
            color: "#217346", background: "#edf7ed",
            letterSpacing: 0.3,
          }}>{row.section}</td>
        </tr>
      );
    }

    // Assumption text row
    if (row.assumption) {
      const rows = [(
        <tr key={i}>
          <td style={rowNumStyle}>{rn}</td>
          <td colSpan={2} style={{
            border: "1px solid #d0d0d0", padding: cellPad,
            fontSize: isCompact ? 9 : 11, color: "#555",
            fontStyle: "italic", lineHeight: 1.4,
            background: "#fafafa",
          }}>
            {"\u2022 " + row.assumption}
          </td>
        </tr>
      )];
      if (row.note) {
        rowCounter++;
        rows.push(
          <tr key={i + "-note"}>
            <td style={rowNumStyle}>{rowCounter + 3}</td>
            <td colSpan={2} style={{
              border: "1px solid #d0d0d0",
              padding: isCompact ? "3px 6px 3px 16px" : "4px 8px 4px 20px",
              fontSize: isCompact ? 9 : 11, color: "#1a8c3a",
              fontStyle: "italic", fontWeight: 600,
              background: "#f4fdf6",
            }}>
              {"\u270E " + row.note}
            </td>
          </tr>
        );
      }
      return rows;
    }

    // Spacer
    if (row.spacer) {
      return (
        <tr key={i}>
          <td style={rowNumStyle}>{rn}</td>
          <td style={{ border: "1px solid #d0d0d0", padding: spacerPad }}></td>
          <td style={{ border: "1px solid #d0d0d0", padding: spacerPad }}></td>
        </tr>
      );
    }

    // Data row
    const isNeg = row.value != null && row.value < 0;
    const dataRows = [(
      <tr key={i}>
        <td style={rowNumStyle}>{rn}</td>
        <td style={{
          border: "1px solid #d0d0d0", padding: cellPad,
          fontWeight: row.bold ? 700 : 400, fontSize: fs,
          color: "#1a1a1a",
          borderTop: row.topBorder ? "1.5px solid #333" : undefined,
          borderBottom: row.doubleBorder ? "3px double #333" : undefined,
          background: row.highlight ? "#fff8e1" : "white",
        }}>{row.label}</td>
        <td style={{
          border: "1px solid #d0d0d0", padding: cellPad,
          fontWeight: row.bold ? 700 : 400, fontSize: fs,
          textAlign: "right",
          fontFamily: '"Consolas", "Courier New", monospace',
          color: isNeg ? "#c00" : "#1a1a1a",
          borderTop: row.topBorder ? "1.5px solid #333" : undefined,
          borderBottom: row.doubleBorder ? "3px double #333" : undefined,
          background: row.highlight ? "#fff8e1" : "white",
        }}>
          {row.text || formatCurrency(row.value)}
        </td>
      </tr>
    )];

    // Green auditor note beneath data row
    if (row.note) {
      rowCounter++;
      dataRows.push(
        <tr key={i + "-note"}>
          <td style={rowNumStyle}>{rowCounter + 3}</td>
          <td colSpan={2} style={{
            border: "1px solid #d0d0d0",
            padding: isCompact ? "3px 6px 3px 16px" : "4px 8px 4px 20px",
            fontSize: isCompact ? 9 : 11,
            color: "#1a8c3a",
            fontStyle: "italic",
            fontWeight: 600,
            background: "#f4fdf6",
          }}>
            {"\u270E " + row.note}
          </td>
        </tr>
      );
    }

    return dataRows;
  };

  // Reset counter on each render
  rowCounter = 0;

  return (
    <div style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column", overflow: "auto" }}>
      {/* Excel ribbon bar */}
      <div style={{
        background: "#217346", padding: isCompact ? "3px 12px" : "5px 12px",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        {["File", "Home", "Insert", "Page Layout", "Formulas"].map((tab, i) => (
          <span key={tab} style={{
            color: i === 1 ? "white" : "rgba(255,255,255,0.7)",
            fontSize: isCompact ? 10 : 11,
            fontFamily: f, cursor: "pointer",
            borderBottom: i === 1 ? "2px solid white" : "none",
            paddingBottom: 2,
          }}>{tab}</span>
        ))}
      </div>
      {/* Formula bar */}
      <div style={{
        display: "flex", borderBottom: "1px solid #d4d4d4",
        background: "#f6f6f6", alignItems: "center",
      }}>
        <div style={{
          width: 48, borderRight: "1px solid #d4d4d4",
          padding: "3px 6px", fontSize: 11, fontFamily: f,
          color: "#333", textAlign: "center", background: "#fff",
        }}>A1</div>
        <div style={{
          flex: 1, padding: "3px 8px", fontSize: 11, fontFamily: f,
          color: "#555", fontStyle: "italic",
        }}>{data.title}</div>
      </div>
      {/* Spreadsheet grid */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontFamily: f, fontSize: fs,
        }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{
                width: 28, minWidth: 28, background: "#e8e8e8",
                border: "1px solid #d0d0d0", padding: "3px 0",
                fontSize: 10, color: "#888", fontWeight: 400,
              }}></th>
              <th style={{
                border: "1px solid #d0d0d0", padding: "3px 4px",
                fontSize: 10, color: "#888", fontWeight: 400,
                textAlign: "center",
              }}>A</th>
              <th style={{
                border: "1px solid #d0d0d0", padding: "3px 4px",
                fontSize: 10, color: "#888", fontWeight: 400,
                textAlign: "center", width: "38%",
              }}>B</th>
            </tr>
          </thead>
          <tbody>
            {/* Title row */}
            <tr>
              <td style={rowNumStyle}>1</td>
              <td colSpan={2} style={{
                border: "1px solid #d0d0d0",
                padding: isCompact ? "4px 6px" : "6px 8px",
                fontWeight: 700, fontSize: isCompact ? 11 : 13,
                color: "#217346", background: "#f9fdf9",
              }}>{data.title}</td>
            </tr>
            {/* Client line */}
            <tr>
              <td style={rowNumStyle}>2</td>
              <td colSpan={2} style={{
                border: "1px solid #d0d0d0",
                padding: isCompact ? "3px 6px" : "4px 8px",
                fontSize: isCompact ? 9 : 11, color: "#888",
                fontStyle: "italic",
              }}>Client: Sample Corp — Reporting Unit Alpha</td>
            </tr>
            {/* Header row */}
            <tr style={{ background: "#f5f5f5" }}>
              <td style={rowNumStyle}>3</td>
              <td style={{
                border: "1px solid #d0d0d0", padding: cellPad,
                fontWeight: 700, fontSize: fs,
                borderBottom: "2px solid #217346",
              }}>Description</td>
              <td style={{
                border: "1px solid #d0d0d0", padding: cellPad,
                fontWeight: 700, textAlign: "right", fontSize: fs,
                borderBottom: "2px solid #217346",
              }}>Amount</td>
            </tr>
            {/* Data rows */}
            {data.rows.map((row, i) => renderRow(row, i))}
            {/* Extra empty rows for realism */}
            {[...Array(3)].map((_, i) => {
              rowCounter++;
              const rn = rowCounter + 3;
              return (
                <tr key={"empty-" + i}>
                  <td style={rowNumStyle}>{rn}</td>
                  <td style={{ border: "1px solid #d0d0d0", padding: isCompact ? "4px" : "6px" }}></td>
                  <td style={{ border: "1px solid #d0d0d0", padding: isCompact ? "4px" : "6px" }}></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Sheet tabs */}
      <div style={{
        borderTop: "1px solid #d4d4d4", background: "#e8e8e8",
        padding: "0 8px", display: "flex", alignItems: "center",
        height: isCompact ? 22 : 26,
      }}>
        <div style={{
          background: "white", border: "1px solid #d0d0d0", borderBottom: "none",
          padding: isCompact ? "2px 10px" : "3px 14px",
          fontSize: 10, fontFamily: f, color: "#217346", fontWeight: 600,
          marginTop: 1,
        }}>Goodwill</div>
        <div style={{
          background: "#e0e0e0", border: "1px solid #d0d0d0", borderBottom: "none",
          padding: isCompact ? "2px 10px" : "3px 14px",
          fontSize: 10, fontFamily: f, color: "#888",
          marginTop: 1, marginLeft: 2,
        }}>Notes</div>
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
    <AppWindow title="E-mail Client — New Message" onClose={onClose} zIndex={zIndex} onFocus={onFocus} accentColor="#0078D4" layout={layout}>
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
function IMWindow({ onClose, zIndex, onFocus, layout }) {
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: "manager", text: "lmk if you need anything, slammed today", time: "9:02 AM" },
  ]);
  const chatRef = useRef(null);
  const isCompact = layout === "landscape";

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = async () => {
    if (!msg.trim() || typing) return;
    const userMsg = { from: "you", text: msg.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setMsg("");
    setTyping(true);

    try {
      const reply = await sendIM(updated);
      setMessages(prev => [...prev, {
        from: "manager",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
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

  return (
    <AppWindow title="Instant Message Manager" onClose={onClose} zIndex={zIndex} onFocus={onFocus} accentColor="#7B83EB" layout={layout}>
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
          <div style={{ fontSize: 11, color: "#4CAF50", fontFamily: '"Segoe UI", sans-serif' }}>● Online — Senior Manager</div>
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
      <div style={{
        padding: isCompact ? "4px 10px" : "8px 10px",
        borderTop: "1px solid #e8e8e8",
        display: "flex", gap: 8, background: "#f9f9f9",
      }}>
        <input
          value={msg} onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type a message..."
          disabled={typing}
          style={{
            flex: 1, border: "1px solid #ddd", borderRadius: 4,
            padding: "8px 12px", fontSize: 16, outline: "none",
            fontFamily: '"Segoe UI", sans-serif',
            opacity: typing ? 0.6 : 1,
          }}
        />
        <button onClick={send} disabled={typing} style={{
          background: typing ? "#aaa" : "#7B83EB", color: "white", border: "none",
          borderRadius: 4, padding: "8px 16px", cursor: typing ? "default" : "pointer",
          fontFamily: '"Segoe UI", sans-serif', fontSize: 13, fontWeight: 600,
        }}>Send</button>
      </div>
    </AppWindow>
  );
}

/* ─── FINALIZE DOCUMENTATION WINDOW ────────────────────────────────── */
function FinalizeWindow({ onClose, zIndex, onFocus, layout }) {
  const [submitted, setSubmitted] = useState(false);
  const isCompact = layout === "landscape";

  return (
    <AppWindow title="Finalize Documentation" onClose={onClose} zIndex={zIndex} onFocus={onFocus} accentColor="#E8453C" layout={layout}>
      <div style={{
        padding: isCompact ? "14px 20px" : "30px 24px", textAlign: "center",
        display: "flex", flexDirection: isCompact ? "row" : "column",
        alignItems: "center", gap: isCompact ? 16 : 16,
        justifyContent: "center", flex: 1,
      }}>
        {!submitted ? (
          <>
            <div style={{
              width: isCompact ? 40 : 56, height: isCompact ? 40 : 56,
              borderRadius: "50%", background: "#FFF3E0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isCompact ? 20 : 28, flexShrink: 0,
            }}>⚠️</div>
            <div style={{ textAlign: isCompact ? "left" : "center" }}>
              <div style={{
                fontSize: isCompact ? 14 : 16, fontWeight: 600, color: "#1a1a1a",
                fontFamily: '"Segoe UI", sans-serif', lineHeight: 1.4,
              }}>
                Complete and Submit Documentation Before the Deadline
              </div>
              <div style={{
                fontSize: 13, color: "#666", fontFamily: '"Segoe UI", sans-serif',
                maxWidth: 320, lineHeight: 1.5, marginTop: 6,
              }}>
                Please ensure all working papers, client communications, and review notes have been finalized before submitting.
              </div>
              <button onClick={() => setSubmitted(true)} style={{
                background: "#E8453C", color: "white", border: "none",
                padding: isCompact ? "8px 28px" : "12px 40px",
                fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: '"Segoe UI", sans-serif',
                marginTop: isCompact ? 8 : 14, borderRadius: 2,
                boxShadow: "0 2px 8px rgba(232,69,60,0.3)",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#d13a32"}
                onMouseLeave={e => e.currentTarget.style.background = "#E8453C"}
              >Submit Documentation</button>
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: isCompact ? 40 : 56, height: isCompact ? 40 : 56,
              borderRadius: "50%", background: "#E8F5E9",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isCompact ? 20 : 28, flexShrink: 0,
            }}>✓</div>
            <div style={{ textAlign: isCompact ? "left" : "center" }}>
              <div style={{
                fontSize: 16, fontWeight: 600, color: "#2E7D32",
                fontFamily: '"Segoe UI", sans-serif',
              }}>Documentation Submitted</div>
              <div style={{ fontSize: 13, color: "#666", fontFamily: '"Segoe UI", sans-serif', marginTop: 4 }}>
                Your documentation has been submitted for review.
              </div>
            </div>
          </>
        )}
      </div>
    </AppWindow>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN DESKTOP
   ═══════════════════════════════════════════════════════════════════ */
const DESKTOP_ITEMS = [
  { id: "cy-folder", label: "Current Year Audit\nWorking Papers", type: "folder-cy" },
  { id: "py-folder", label: "Prior Year Audit\nWorking Papers", type: "folder-py" },
  { id: "email", label: "E-mail Client", type: "email" },
  { id: "im", label: "Instant Message\nManager", type: "im" },
  { id: "finalize", label: "Finalize\nDocumentation", type: "finalize" },
];

function getIcon(type, size) {
  const s = { width: size, height: size };
  return (
    <div style={s}>
      {type === "folder-cy" && <FolderIcon />}
      {type === "folder-py" && <FolderIcon color="#BDB76B" />}
      {type === "email" && <EmailIcon />}
      {type === "im" && <IMIcon />}
      {type === "finalize" && <DocIcon />}
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
    if (id === "finalize") setNotifPulse(false);
    setTopZ(z => {
      setWindowZ(prev => ({ ...prev, [id]: z + 1 }));
      return z + 1;
    });
    setStartOpen(false);
  }, []);

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
              {item.type === "finalize" && notifPulse && (
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
        <FolderWindow title="Current Year Audit Working Papers" fileName="CY Goodwill Impairment.xlsx"
          spreadsheetData={CY_DATA}
          onClose={() => closeApp("cy-folder")} zIndex={windowZ["cy-folder"] || 10}
          onFocus={() => focusApp("cy-folder")} layout={layout} />
      )}
      {openWindows.includes("py-folder") && (
        <FolderWindow title="Prior Year Audit Working Papers" fileName="PY Goodwill Impairment.xlsx"
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
          onFocus={() => focusApp("im")} layout={layout} />
      )}
      {openWindows.includes("finalize") && (
        <FinalizeWindow onClose={() => closeApp("finalize")} zIndex={windowZ["finalize"] || 10}
          onFocus={() => focusApp("finalize")} layout={layout} />
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
    </div>
  );
}