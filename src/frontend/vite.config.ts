import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }), // 번들 분석 결과 자동 열기
    sentryVitePlugin({
      org: 'kickzo',
      project: 'kicktube',
      telemetry: false,
    }),
  ],

  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
    ],
  },

  define: {
    global: 'window',
  },

  build: {
    sourcemap: true,
  },
});
