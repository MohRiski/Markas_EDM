import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from "@vite-pwa/sveltekit";

export default defineConfig({
	plugins: [
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Markas EDM',
				short_name: 'EDM',
				description: 'Sistem Manajemen Berkas EDM',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				display: 'standalone',
				start_url: '/',
				icons: [
				{
					src: '/icon/logo.png',
					sizes: '192x192',
					type: 'image/png'
				},
				{
					src: '/icon/logo.png',
					sizes: '512x512',
					type: 'image/png'
				}
				]
			},
			devOptions: {
				enabled: true
			}
		}),
		sveltekit(),
	]
});
