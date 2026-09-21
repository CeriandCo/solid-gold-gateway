// Makes the local PostgREST look like a Supabase REST endpoint:
// /rest/v1/* -> PostgREST /*, and /auth/v1/* fails loudly (the isolated
// database has no auth server, and no isolated suite may need one).
import { createServer } from "node:http";

const listenPort = Number(process.env["PROXY_PORT"] ?? 54331);
const restPort = Number(process.env["REST_PORT"] ?? 54330);

const server = createServer(async (req, res) => {
  const url = req.url ?? "/";
  if (!url.startsWith("/rest/v1")) {
    res.writeHead(501, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `The isolated test database only serves /rest/v1 (got ${url.split("?")[0]}).`,
      }),
    );
    return;
  }

  const target = `http://127.0.0.1:${restPort}${url.slice("/rest/v1".length) || "/"}`;
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (["host", "connection", "content-length", "apikey", "authorization"].includes(key)) continue;
    headers[key] = Array.isArray(value) ? value.join(",") : String(value);
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      ...(chunks.length ? { body: Buffer.concat(chunks) } : {}),
    });
    const body = Buffer.from(await upstream.arrayBuffer());
    const out = {};
    upstream.headers.forEach((value, key) => {
      if (key === "content-encoding" || key === "content-length") return;
      out[key] = value;
    });
    res.writeHead(upstream.status, out);
    res.end(body);
  } catch (error) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `Test database proxy failed: ${String(error)}` }));
  }
});

server.listen(listenPort, "127.0.0.1");
