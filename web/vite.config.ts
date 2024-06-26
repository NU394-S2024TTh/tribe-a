/// <reference types="vitest" />s
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
	},
	plugins: [react()],
	build: {
		rollupOptions: {
			external: ['@langchain/core'],
		},
	},
});
