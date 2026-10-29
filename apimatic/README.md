# OneThing API: SDKs and docs portal (APIMatic)

`src/` is an APIMatic build directory:

| File | What it is |
|---|---|
| `src/spec/openapi.yaml` | The OneThing API (OpenAPI 3.1). Also served live at `/openapi.yaml`. |
| `src/spec/APIMATIC-META.json` | Code generation settings |
| `src/APIMATIC-BUILD.json` | Portal settings: title, colours, SDK languages (TypeScript, Python, HTTP), API Copilot (the "Ask AI" chat, set with `apimatic portal copilot`) and recipes |
| `src/content/` | Hand-written guides, the recipe page and the portal's table of contents |
| `src/static/scripts/recipes/` | The API Recipe "An AI agent buys a product": a guided walkthrough whose steps call the live agent endpoints. Registered under `recipes` in `APIMATIC-BUILD.json` |

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

Output (`portal/`, `sdk/`, `sdk-publish/`, `plugin/`) is git-ignored; regenerate it from `src/`.

## Publish the SDKs and the Context Plugin

The SDK source is published to GitHub (no npm or PyPI packages) through the APIMatic publishing
profile `OneThing`, made in the APIMatic app under Publishing Center with a GitHub credential:

```bash
apimatic publishing profile list                     # shows the profile id
apimatic sdk publish -p <id> -l typescript -v 1.0.0 --publish-type sourcecode -d ./sdk-publish/typescript
apimatic sdk publish -p <id> -l python -v 1.0.0 --publish-type sourcecode -d ./sdk-publish/python
apimatic plugin generate --force                     # Context Plugin into plugin/
```

Each publish replaces everything in the target repo. `sdk publish` records each repo in
`src/plugin-config.json`, which also holds the plugin's id, name and version, so `plugin generate`
runs without prompts. The plugin's skills teach a coding agent (Claude Code, Cursor, VS Code, Codex)
to install and call the SDKs from those repos.

The portal is published at https://omarmiri.github.io/one-thing/ from the `gh-pages` branch,
which holds only the contents of `portal/` (without `apimatic-debug/`) plus an empty `.nojekyll`.
To republish after a spec change, run `apimatic portal generate --force` and push a fresh commit
of that folder to `gh-pages`. Its "Try it" calls (and the recipe's steps) work because `src/proxy.ts` allows CORS from that origin on `/api/*`.

When you change an API route in `src/app/api/`, update `src/spec/openapi.yaml` in the same
commit, then run `apimatic api validate --file=src/spec/openapi.yaml` from `apimatic/`.

Every operation carries a sample request body (`example`, or named `examples` for several cases)
and a sample 2xx reply, and every path or query parameter has an `example`. The portal builds its
code samples from them, so a new endpoint needs both. The samples share one made-up world: the
`vintageskates` and `raptorrush` shops, order `pX4kR9tVb2nQ7sLe`, PayPal order `5O190127TN364715T`.
`apimatic api validate` flags an example that doesn't match its schema.

Every schema and property also has a `description` and an `examples` entry, which APIMatic's API
score counts. What `apimatic api validate` still warns about is on purpose: inline object and enum
schemas (moving them to `components` would rename the SDK models), per-operation `security`
(public and bearer-only routes), and redirect or empty replies that have no body to describe.
