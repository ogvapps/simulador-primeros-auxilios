import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno basadas en el modo (development/production)
  // el tercer argumento '' carga todas las variables, no solo las que empiezan por VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Esto permite usar process.env.API_KEY en tu código React (Vite lo reemplaza al construir)
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});