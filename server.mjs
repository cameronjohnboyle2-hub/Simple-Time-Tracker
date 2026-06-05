import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const file = pathname === "/" || pathname === "/admin" ? "index.html" : pathname.slice(1);
  const fullPath = resolve(join(root, file));

  if (!fullPath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await readFile(fullPath);
    res.writeHead(200, {
      "Content-Type": types[extname(fullPath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, host, () => {
  console.log(`Time clock running at http://${host}:${port}`);
});
