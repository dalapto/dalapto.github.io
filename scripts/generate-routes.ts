/**
 * Post-build script: pre-generate a dist/<route>/index.html for every route
 * defined in src/routes-data.ts.
 *
 * This makes GitHub Pages return HTTP 200 (not 404) for direct URL access,
 * and gives each page its own <title> and Open Graph meta tags for link previews.
 *
 * Run via: tsx scripts/generate-routes.ts
 * Hooked into: npm run build
 */

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { BASE_URL, routesData, type RouteData } from '../src/routes-data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

function buildMetaTags(route: RouteData): string {
	const url = `${BASE_URL}${route.path}`;
	const tags = [
		`<meta property="og:type" content="website" />`,
		route.ogTitle ? `<meta property="og:title" content="${route.ogTitle}" />` : '',
		route.ogDescription
			? `<meta property="og:description" content="${route.ogDescription}" />`
			: '',
		`<meta property="og:url" content="${url}" />`,
		route.ogImage ? `<meta property="og:image" content="${route.ogImage}" />` : '',
		`<meta name="twitter:card" content="${route.ogImage ? 'summary_large_image' : 'summary'}" />`,
		route.ogDescription
			? `<meta name="description" content="${route.ogDescription}" />`
			: '',
	];
	return tags.filter(Boolean).join('\n\t\t');
}

function injectMeta(html: string, route: RouteData): string {
	let result = html;
	if (route.ogTitle) {
		result = result.replace(/<title>[^<]*<\/title>/, `<title>${route.ogTitle}</title>`);
	}
	return result.replace('</head>', `\t\t${buildMetaTags(route)}\n\t</head>`);
}

// Patch dist/index.html itself with root OG tags
const rootRoute = routesData.find((r) => r.path === '/');
if (rootRoute) {
	writeFileSync(join(distDir, 'index.html'), injectMeta(template, rootRoute));
	console.log('Patched:   /  →  dist/index.html');
}

// Generate dist/<path>/index.html for every non-root route
const nonRootRoutes = routesData.filter((r) => r.path !== '/');
for (const route of nonRootRoutes) {
	const dir = join(distDir, route.path);
	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, 'index.html'), injectMeta(template, route));
	console.log(`Generated: ${route.path}  →  dist${route.path}/index.html`);
}

console.log(`\nDone — ${nonRootRoutes.length + 1} route(s) processed.`);
