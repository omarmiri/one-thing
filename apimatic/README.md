# OneThing API: SDKs and docs portal (APIMatic)

`src/` is an APIMatic build directory:

| File | What it is |
|---|---|
| `src/spec/openapi.yaml` | The OneThing API (OpenAPI 3.1). Also served live at `/openapi.yaml`. |
| `src/spec/APIMATIC-META.json` | Code generation settings |
| `src/APIMATIC-BUILD.json` | Portal settings: title, colours, SDK languages (TypeScript, Python, HTTP) |
| `src/content/` | Hand-written guides and the portal's table of contents |

## Generate

```bash
npm install -g @apimatic/cli
apimatic auth login                                  # once, in the browser

cd apimatic
apimatic api validate --file=src/spec/openapi.yaml   # APIMatic's own lint
apimatic portal serve --open                         # docs portal + SDKs, live preview
apimatic sdk generate --language=typescript          # SDK into sdk/typescript
apimatic portal generate --zip                       # static portal to host anywhere
```

Output (`portal/`, `sdk/`, `plugin/`) is git-ignored; regenerate it from `src/`.

When you change an API route in `src/app/api/`, update `src/spec/openapi.yaml` in the same
commit, then run `npx @redocly/cli@1 lint apimatic/src/spec/openapi.yaml`.
