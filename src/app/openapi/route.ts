// The OpenAPI spec (/openapi.yaml) rendered for people with Redoc: a person following the link
// gets readable docs, while /openapi.yaml stays the raw file for tools and downloads. A plain HTML
// page outside the app layout, since Redoc brings its own three-column layout.

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OneThing API · OpenAPI</title>
<meta name="description" content="The OneThing REST API, rendered from its OpenAPI 3.1 spec.">
<style>
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #fff; }
  .bar { position: sticky; top: 0; z-index: 10; height: 52px; box-sizing: border-box; display: flex; align-items: center;
         gap: 16px; padding: 0 16px; border-bottom: 1px solid #e5e5e5; background: #fff; font-size: 14px; }
  .bar a { color: #171717; text-decoration: none; }
  .bar .home { font-weight: 600; }
  .bar .muted { color: #737373; }
  .bar .dl { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #e5e5e5;
             border-radius: 999px; padding: 6px 14px; font-weight: 600; }
  .bar .dl:hover { border-color: #1f4fd8; color: #1f4fd8; }
  @media (max-width: 560px) { .bar .muted { display: none; } }
</style>
</head>
<body>
<div class="bar">
  <a class="home" href="/">OneThing</a>
  <span class="muted">API reference, from <a href="/openapi.yaml">openapi.yaml</a></span>
  <a class="dl" href="/openapi.yaml" download="onething-openapi.yaml">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
    Download
  </a>
</div>
<div id="redoc"></div>
<script src="https://cdn.jsdelivr.net/npm/redoc@2.1.5/bundles/redoc.standalone.js"></script>
<script>
  Redoc.init("/openapi.yaml", {
    scrollYOffset: 52,
    hideDownloadButton: true,
    expandResponses: "200,201",
    pathInMiddlePanel: true,
    theme: {
      colors: { primary: { main: "#1f4fd8" } },
      typography: { fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", headings: { fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" } },
      sidebar: { backgroundColor: "#fafafa" },
      rightPanel: { backgroundColor: "#171717" },
    },
  }, document.getElementById("redoc"));
</script>
</body>
</html>`;

export function GET() {
  return new Response(HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
}
