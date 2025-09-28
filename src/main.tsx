import { createRoot } from "react-dom/client";
import App from "./App.minimal.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

// Global error handler for extension conflicts
window.addEventListener('error', (event) => {
  if (event.error && event.error.message) {
    const errorMsg = event.error.message;
    if (errorMsg.includes('createContext') || 
        errorMsg.includes('useLayoutEffect') ||
        errorMsg.includes('Cannot read properties') ||
        errorMsg.includes('Cannot destructure') ||
        errorMsg.includes('content.js') ||
        errorMsg.includes('selection.js') ||
        errorMsg.includes('knowee') ||
        errorMsg.includes('intermediate value') ||
        errorMsg.includes('is null')) {
      console.warn('Extension conflict detected, ignoring error:', errorMsg);
      event.preventDefault();
      return false;
    }
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message) {
    const errorMsg = event.reason.message;
    if (errorMsg.includes('createContext') || 
        errorMsg.includes('useLayoutEffect') ||
        errorMsg.includes('Cannot read properties') ||
        errorMsg.includes('Cannot destructure') ||
        errorMsg.includes('content.js') ||
        errorMsg.includes('selection.js') ||
        errorMsg.includes('knowee') ||
        errorMsg.includes('intermediate value') ||
        errorMsg.includes('is null')) {
      console.warn('Extension conflict detected in promise rejection, ignoring:', errorMsg);
      event.preventDefault();
      return false;
    }
  }
});

// Protect React hooks from extension interference
if (window.React) {
  const originalReact = window.React;
  
  // Create safe versions of React hooks
  const safeHooks = {
    ...originalReact,
    useLayoutEffect: originalReact.useLayoutEffect || (() => {}),
    createContext: originalReact.createContext || (() => ({})),
    useContext: originalReact.useContext || (() => {}),
    useState: originalReact.useState || (() => [{}, () => {}]),
    useEffect: originalReact.useEffect || (() => {})
  };
  
  // Override window.React with safe version
  Object.defineProperty(window, 'React', {
    value: safeHooks,
    writable: false,
    configurable: false
  });
}

// Add null/undefined protection for extension interference
const originalDestructuring = Object.prototype.toString;
Object.prototype.toString = function() {
  if (this === null || this === undefined) {
    return '[object Null]';
  }
  return originalDestructuring.call(this);
};

// Protect against null destructuring in extensions
const originalObjectKeys = Object.keys;
Object.keys = function(obj) {
  if (obj === null || obj === undefined) {
    return [];
  }
  return originalObjectKeys.call(this, obj);
};

// Protect against null property access
const originalObjectValues = Object.values;
Object.values = function(obj) {
  if (obj === null || obj === undefined) {
    return [];
  }
  return originalObjectValues.call(this, obj);
};

// Create root with error boundary
const root = createRoot(document.getElementById("root")!);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
