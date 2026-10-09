import { test } from "node:test";
import assert from "node:assert/strict";
import { request } from "node:http";
import { createDemoServer } from "../server.mjs";

test("the local server exposes only public files and blocks malformed/traversal requests", async () => {
  const server = createDemoServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const get = (path, method = "GET") => new Promise((resolve, reject) => {
    const req = request({ hostname: "127.0.0.1", port, path, method }, (response) => {
      let body = "";
      response.on("data", (chunk) => body += chunk);
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body }));
    });
    req.on("error", reject); req.end();
  });
  try {
    const page = await get("/");
    assert.equal(page.status, 200);
    assert.match(page.headers["content-security-policy"], /connect-src 'none'/);
    assert.match(page.body, /Fictional data only/);
    assert.equal((await get("/admin")).status, 200);
    assert.equal((await get("/package.json")).status, 404);
    assert.equal((await get("/README.md")).status, 404);
    assert.equal((await get("/../package.json")).status, 404);
    assert.equal((await get("/%2e%2e%2fpackage.json")).status, 403);
    assert.equal((await get("/..%5cpackage.json")).status, 403);
    assert.equal((await get("/.env")).status, 403);
    assert.equal((await get("/%E0%A4%A")).status, 400);
    assert.equal((await get("/", "POST")).status, 405);
    assert.equal((await get("/", "HEAD")).body, "");
  } finally { await new Promise((resolve) => server.close(resolve)); }
});
