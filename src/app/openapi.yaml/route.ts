import { readFile } from "node:fs/promises";
import path from "node:path";

// The OneThing API description (apimatic/src/spec/openapi.yaml), for APIMatic, Postman and AI agents.
export async function GET() {
  const spec = await readFile(path.join(process.cwd(), "apimatic/src/spec/openapi.yaml"), "utf8");
  return new Response(spec, {
    headers: {
      "content-type": "application/yaml; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=300",
    },
  });
}
