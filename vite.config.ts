import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We cast process to any to avoid TS errors regarding 'cwd' in some environments
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // Explicitly define env vars to ensure they are injected into the client as string literals
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY),
      // Polyfill process.env to prevent "process is not defined" errors
      'process.env': {}
    }
  }
})