/**
 * Post-build prerender for the project blog pages.
 *
 * The site is a client-rendered SPA, so social scrapers (LinkedIn, WhatsApp,
 * Slack, ...) that don't run JS only see the generic tags in index.html. This
 * script boots the already-built SPA in a headless browser, visits each
 * /project/<slug> route, lets ProjectView set its per-project title/OG tags,
 * and writes the fully-rendered HTML to dist/project/<slug>.html. nginx serves
 * those files for the clean project URLs (see nginx.conf try_files $uri.html).
 *
 * It rewrites the local dev origin to the production origin so og:image /
 * og:url / canonical point at the real domain. Real users still get the SPA:
 * the prerendered HTML ships the same <script>, Vue mounts and re-renders.
 *
 * Local:  CHROMIUM_PATH="<path to Edge/Chrome>" npm run prerender
 * Docker: CHROMIUM_PATH=/usr/bin/chromium-browser npm run prerender
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
import {publishedSlugs} from '../src/data/slugs.js';

const DIST = path.resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const PROD_ORIGIN = process.env.SITE_ORIGIN || 'https://milovanderpas.nl';
const PORT = 4183;

const MIME = {
    '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
    '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
    '.ico': 'image/x-icon', '.map': 'application/json',
};

// Static server with SPA fallback: real files are served as-is; anything that
// looks like a route (no matching file) returns index.html so the SPA boots.
function createServer() {
    const index = fs.readFileSync(path.join(DIST, 'index.html'));
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(req.url.split('?')[0]);
        const filePath = path.join(DIST, urlPath);
        if (urlPath !== '/' && filePath.startsWith(DIST) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.writeHead(200, {'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream'});
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(index);
        }
    });
}

// Common local browser locations, used when CHROMIUM_PATH is not set (Docker
// always sets it to the Alpine system chromium).
const LOCAL_BROWSERS = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function resolveExecutable() {
    if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
    const found = LOCAL_BROWSERS.find(p => fs.existsSync(p));
    if (!found) {
        throw new Error('No browser found. Set CHROMIUM_PATH to a Chrome/Chromium/Edge executable.');
    }
    return found;
}

async function launchBrowser() {
    return puppeteer.launch({
        executablePath: resolveExecutable(),
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
        headless: true,
    });
}

async function run() {
    if (!fs.existsSync(path.join(DIST, 'index.html'))) {
        throw new Error(`dist/index.html not found — run "npm run build" first (looked in ${DIST})`);
    }
    const routes = publishedSlugs.map(slug => ({slug, url: `/project/${slug}`}));
    const server = createServer();
    await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve));
    const localOrigin = `http://127.0.0.1:${PORT}`;
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    let ok = 0;
    for (const {slug, url} of routes) {
        await page.goto(localOrigin + url, {waitUntil: 'networkidle0', timeout: 30000});
        await page.waitForFunction(() => document.title && document.title.includes('|'), {timeout: 5000}).catch(() => {});
        await sleep(300);
        let html = await page.content();
        // Point og:image / og:url / canonical at the real domain.
        html = html.split(localOrigin).join(PROD_ORIGIN);
        const outFile = path.join(DIST, 'project', `${slug}.html`);
        fs.mkdirSync(path.dirname(outFile), {recursive: true});
        fs.writeFileSync(outFile, html);
        const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '(no title)';
        const ogImg = (html.match(/property="og:image" content="([^"]*)"/) || [])[1] || '(none)';
        console.log(`✓ /project/${slug}  ->  title="${title}"  og:image=${ogImg}`);
        ok++;
    }

    await browser.close();
    await new Promise(resolve => server.close(resolve));
    console.log(`\nPrerendered ${ok}/${routes.length} project pages into dist/project/.`);
    if (ok !== routes.length) process.exit(1);
}

run().catch(err => {
    console.error('PRERENDER FAILED:', err.message);
    process.exit(1);
});
