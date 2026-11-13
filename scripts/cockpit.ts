/**
 * Petit serveur local pour le cockpit produit.
 * - http://localhost:4321/        → le cockpit (docs/cockpit/index.html, qui lit backlog.json)
 * - http://localhost:4321/vision  → docs/product.md converti en HTML, pour le lire confortablement
 * Pourquoi un serveur : un navigateur interdit à une page ouverte en double-clic de lire le
 * fichier backlog.json posé à côté d'elle. Servie par http://localhost, la page peut le lire.
 * Lancer : npm run cockpit
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { marked } from "marked";

const ROOT = resolve("docs/cockpit");
const VISION_FILE = resolve("docs/product.md");
const PORT = Number(process.env.COCKPIT_PORT ?? 4321);
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

// Mise en page de la vision : mêmes couleurs que le cockpit, thème clair et sombre.
function visionPage(bodyHtml: string): string {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Smart Board — Vision</title>
<style>
  :root { --bg:#f6f7f9; --surface:#fff; --text:#1b1d22; --muted:#666b75; --border:#e1e4ea; --accent:#5b4bdb; }
  @media (prefers-color-scheme: dark) { :root { --bg:#131419; --surface:#1c1e25; --text:#eceef3; --muted:#9a9fab; --border:#2d3039; --accent:#9d92ff; } }
  body { margin:0; background:var(--bg); color:var(--text); font:15px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
  main { max-width:860px; margin:0 auto; padding:24px 16px 64px; }
  a { color:var(--accent); }
  h1 { font-size:26px; } h2 { font-size:21px; margin-top:36px; } h3 { font-size:17px; } h4 { font-size:15px; }
  blockquote { margin:0; padding:10px 14px; border-left:4px solid var(--accent); background:var(--surface); border-radius:6px; color:var(--muted); }
  table { border-collapse:collapse; width:100%; display:block; overflow-x:auto; }
  th, td { border:1px solid var(--border); padding:6px 10px; text-align:left; vertical-align:top; }
  th { background:var(--surface); }
  hr { border:0; border-top:1px solid var(--border); margin:32px 0; }
  code { background:var(--surface); border:1px solid var(--border); border-radius:4px; padding:0 4px; font-size:13px; }
  .back { display:inline-block; margin-bottom:8px; }
</style></head>
<body><main><a class="back" href="/">← Cockpit</a>${bodyHtml}</main></body></html>`;
}

const server = createServer(async (req, res) => {
  let path: string;
  try {
    path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  } catch {
    res.writeHead(400).end("Adresse invalide");
    return;
  }

  // La vision est relue à chaque visite : modifier product.md puis rafraîchir suffit.
  if (path === "/vision") {
    const markdown = await readFile(VISION_FILE, "utf-8");
    res.writeHead(200, { "Content-Type": TYPES[".html"], "Cache-Control": "no-store" });
    res.end(visionPage(await marked.parse(markdown)));
    return;
  }

  const file = normalize(join(ROOT, path === "/" ? "index.html" : path));
  // On refuse tout chemin qui sortirait du dossier du cockpit (ex. /../.env).
  if (file !== ROOT && !file.startsWith(ROOT + sep)) {
    res.writeHead(403).end("Accès refusé");
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Introuvable");
  }
});

// 127.0.0.1 : le cockpit n'est visible que depuis ton ordinateur, pas depuis le réseau.
server.listen(PORT, "127.0.0.1", () => {
  console.log(`🧭 Cockpit : http://localhost:${PORT}  ·  Vision : http://localhost:${PORT}/vision  (Ctrl+C pour arrêter)`);
});
