import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
	optimizeDeps: {
		entries: ["three", "three-stdlib"],
	},
	resolve: {
		dedupe: ["three", "three-stdlib"],
	},
	plugins: [
		topLevelAwait(),
		wasm(),
	],
	server: {
		fs: {
			strict: false,
			allow: ['C:/Users/Benton/Dev/engine/node_modules/.pnpm/@dimforge+rapier3d@0.14.0/node_modules/@dimforge/rapier3d']
		}
	}
});
