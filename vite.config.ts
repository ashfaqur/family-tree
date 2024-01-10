import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
		  'family-chart': 'node_modules/family-chart/dist/family-chart.js',
		},
	  },
});

