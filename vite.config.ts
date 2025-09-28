import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('ethers')) {
              return 'ethers-vendor';
            }
            if (id.includes('@metamask')) {
              return 'web3-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'utils-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
          
          // Feature chunks
          if (id.includes('/src/pages/auth/')) {
            return 'auth-pages';
          }
          if (id.includes('/src/pages/doctor/')) {
            return 'doctor-pages';
          }
          if (id.includes('/src/pages/patient/')) {
            return 'patient-pages';
          }
          if (id.includes('/src/components/Blockchain') || id.includes('/src/components/WalletConnection')) {
            return 'blockchain-components';
          }
        },
      },
    },
  },
}));
