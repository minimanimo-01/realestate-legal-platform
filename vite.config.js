import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  // Vercel 라우팅 문제 해결을 위해 절대 경로('/') 명시
  base: '/',
  
  plugins: [react()],
  
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // 복잡한 목록 대신, 핵심적인 src 폴더 Alias만 남겨 빌드 단순화
      '@': path.resolve(__dirname, './src'), 
    },
  },
  
  build: {
    target: 'esnext',
    outDir: 'dist',
    // publicDir은 기본값 사용을 위해 명시적으로 제거합니다.
  },
  
  server: {
    port: 3000,
    open: true,
  },
});
