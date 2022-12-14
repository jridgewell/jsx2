import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsx2 from 'babel-plugin-transform-jsx2';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: false,
      babel: {
        // plugins: [
          // [
            // jsx2,
            // {
              // json: false,
              // templateBlocks: false,
              // taggedTemplate: false,
            // },
          // ],
        // ],
      },
    }),
  ],
});
