import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  // 1. base 옵션을 명시적으로 추가합니다.
  base: '/', 
  
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // ... (alias 목록은 그대로 유지)
      'vaul@1.1.2': 'vaul',
      // ...
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // 이전 단계에서 수정한 'dist' 유지
  },
  server: {
    port: 3000,
    open: true,
  },
});
