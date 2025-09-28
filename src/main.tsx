import { createRoot } from "react-dom/client";
import App from "./App.minimal.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

// Global error handler for extension conflicts
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && 
      (event.error.message.includes('createContext') || 
       event.error.message.includes('Cannot read properties') ||
       event.error.message.includes('content.js') ||
       event.error.message.includes('selection.js'))) {
    console.warn('Extension conflict detected, ignoring error:', event.error.message);
    event.preventDefault();
    return false;
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('createContext') || 
       event.reason.message.includes('Cannot read properties') ||
       event.reason.message.includes('content.js') ||
       event.reason.message.includes('selection.js'))) {
    console.warn('Extension conflict detected in promise rejection, ignoring:', event.reason.message);
    event.preventDefault();
    return false;
  }
});

// Create root with error boundary
const root = createRoot(document.getElementById("root")!);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
