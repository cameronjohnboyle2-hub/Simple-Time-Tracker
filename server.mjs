import { createServer } from "node:http";
import { readFile, realpath } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; worker-src 'none'; frame-ancestors 'none'";
const defaultRoot = fileURLToPath(new URL("./public/", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8", ".svg": "image/svg+xml; charset=utf-8" };
const within = (root, target) => { const path = relative(root, target); return path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path); };

export function createDemoServer(root = defaultRoot) {
  const resolvedRoot = resolve(root);
  return createServer(async (req, res) => {
    const headers = {
      "Cache-Control": "no-store", "Content-Security-Policy": contentSecurityPolicy,
      "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer"
    };
    const reply = (status, body) => { res.writeHead(status, { ...headers, "Content-Type": "text/plain; charset=utf-8" }); res.end(body); };
    if (!["GET", "HEAD"].includes(req.method)) { reply(405, "Method not allowed"); return; }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname); }
    catch { reply(400, "Invalid path"); return; }
    if (pathname.includes("\\") || pathname.includes("\0") || pathname.split("/").some((part) => part.startsWith(".") && part !== ".nojekyll")) {
      reply(403, "Forbidden"); return;
    }
    const file = pathname === "/" ? "index.html" : pathname === "/admin" ? "admin.html" : pathname.slice(1);
    const fullPath = resolve(resolvedRoot, file);
    if (!within(resolvedRoot, fullPath)) { reply(403, "Forbidden"); return; }
    try {
      const actualRoot = await realpath(resolvedRoot);
      const actualPath = await realpath(fullPath);
      if (!within(actualRoot, actualPath)) { reply(403, "Forbidden"); return; }
      const data = await readFile(actualPath);
      res.writeHead(200, { ...headers, "Content-Type": types[extname(actualPath)] || "application/octet-stream", "Content-Length": data.length });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch { reply(404, "Not found"); }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4178);
  createDemoServer().listen(port, "127.0.0.1", () => console.log(`Demo available at http://127.0.0.1:${port}`));
}
