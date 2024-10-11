import * as esbuild from "esbuild"
import * as fs from "node:fs/promises";
import { copy } from "esbuild-plugin-copy";

function parseCommand() { return process.argv[2]; }

/** @type {(mode: string) => import("esbuild").BuildOptions} */
const createConfig = (mode) => ({
	entryPoints: ["./playground/PlaygroundEntry.ts"],
	outdir: "./playground/dist",
	bundle: true,
	target: "ES2022",
	format: "esm",
	minify: mode === "build",
	conditions: ["worker", "browser"],
	treeShaking: true,
	metafile: true,
	splitting: true,
	sourcemap: "linked",
	entryNames: mode === 'build' ? "[name]-[hash]" : undefined,
	define: {
		"import.meta.DEV": mode === "dev" ? "true" : "false",
	},
	logLevel: "error",
	plugins: [
		copy({
			resolveFrom: 'cwd',
			assets: {
				from: ['./playground/assets/*'],
				to: ['./playground/dist/assets'],
			},
			watch: true,
		}),
	],
})

async function dev()
{
	const t = performance.now()
	await fs.mkdir("playground/dist", { recursive: true })
	await fs.writeFile("playground/dist/index.html", constructIndexHtml("PlaygroundEntry.js"))

	const ctx = await esbuild.context(createConfig("dev"))

	await ctx.watch()

	await ctx.serve({
		servedir: 'playground/dist',
		fallback: 'playground/dist/index.html',
	})

	console.log(`Dev server started in ${(performance.now() - t).toFixed(1)} ms`)
}

async function build()
{
	console.info("Building playground for production")
	const t = performance.now()
	try { await fs.rm("playground/dist", { recursive: true }) } catch {}
	const output = await esbuild.build(createConfig("build"))
	const path = Object.entries(output.metafile.outputs).find(([p, lol]) => lol.entryPoint === 'playground/PlaygroundEntry.ts')
	await fs.writeFile("playground/dist/index.html", constructIndexHtml(path[0].replace('playground/dist', '')))
	console.log(`Built in ${(performance.now() - t).toFixed(1)} ms`)
}

/** @param {string} entry */
const constructIndexHtml = (entry) => `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Elysia Playground</title>
	<script type="module" src="${entry}"></script>
</head>
<body></body>
</html>`

function main()
{
	switch(parseCommand())
	{
		case "dev": dev(); break;
		case "build": build(); break;
		default: console.error("Invalid command. Please use 'dev' or 'build'.");
	}
}

main();