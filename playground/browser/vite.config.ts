import { defineConfig } from "vite";

export default defineConfig({
	optimizeDeps: {
		entries: ["three", "three-stdlib"],
	},
	resolve: {
		dedupe: ["three", "three-stdlib"],
	},
});
