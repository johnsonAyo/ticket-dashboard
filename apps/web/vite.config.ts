import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const DEV_SERVER_PORT = 5173;

// Consume the shared package straight from its TypeScript source so Vite sees
// clean ES named exports (the compiled CommonJS build is for the Node API).
const sharedSourceEntry = fileURLToPath(
  new URL('../../packages/shared/src/index.ts', import.meta.url),
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ticket/shared': sharedSourceEntry,
    },
  },
  server: {
    port: DEV_SERVER_PORT,
    strictPort: true,
  },
  preview: {
    port: DEV_SERVER_PORT,
    strictPort: true,
  },
});
