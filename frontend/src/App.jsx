import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FilterProvider } from "./contexts/FilterContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles/global.css";

// ─── Error Boundary — shows the crash message instead of blank screen ───────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: "fixed", inset: 0, background: "#0a0f1e",
          color: "#ff6b6b", fontFamily: "monospace", padding: "2rem",
          overflow: "auto", zIndex: 99999, whiteSpace: "pre-wrap",
          fontSize: "13px", lineHeight: 1.6
        }}>
          <h2 style={{ color: "#ff4444", marginBottom: "1rem" }}>⚠ App Crashed — Error Details:</h2>
          <p style={{ color: "#ffaa00", marginBottom: "1rem" }}>{String(this.state.error)}</p>
          <pre style={{ color: "#ccc", borderTop: "1px solid #333", paddingTop: "1rem" }}>
            {this.state.info?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <FilterProvider>
              <AppRoutes />
            </FilterProvider>
            <Toaster position="top-right" richColors closeButton />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
