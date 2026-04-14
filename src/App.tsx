import { ConfigProvider, theme } from "antd";
import { useState } from "react";
import Chapter1 from "./pages/Chapter1";
import Constructor from "./pages/Constructor";

export default function App() {
  const [page, setPage] = useState<"chapter1" | "constructor">("chapter1");

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#7b8cff",
          colorBgContainer: "#0f0f1a",
          colorBgElevated: "#13131f",
          colorBorder: "rgba(100,120,200,0.15)",
          fontFamily: "Manrope, sans-serif",
          borderRadius: 12,
        },
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          background: "rgba(10,10,15,0.95)",
          borderBottom: "1px solid rgba(100,120,200,0.15)",
          borderLeft: "1px solid rgba(100,120,200,0.15)",
          borderRadius: "0 0 0 8px",
        }}
      >
        <button
          onClick={() => setPage("chapter1")}
          style={{
            padding: "7px 16px",
            background:
              page === "chapter1" ? "rgba(123,140,255,0.2)" : "transparent",
            border: "none",
            color: page === "chapter1" ? "#7b8cff" : "#8888aa",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "Manrope, sans-serif",
          }}
        >
          📖 Глава 1
        </button>
        <button
          onClick={() => setPage("constructor")}
          style={{
            padding: "7px 16px",
            background:
              page === "constructor" ? "rgba(123,140,255,0.2)" : "transparent",
            border: "none",
            color: page === "constructor" ? "#7b8cff" : "#8888aa",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "Manrope, sans-serif",
          }}
        >
          ⚡ Конструктор
        </button>
      </div>

      {page === "chapter1" ? <Chapter1 /> : <Constructor />}
    </ConfigProvider>
  );
}
