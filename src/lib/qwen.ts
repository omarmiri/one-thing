import "server-only";

// Qwen on Alibaba Cloud Model Studio, through its OpenAI-compatible endpoint. Only shop designs
// (and refines) can come from here: DESIGN_PROVIDER=qwen. Everything else stays on Gemini.
const BASE_URL = (process.env.QWEN_BASE_URL ?? "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").replace(/\/$/, "");
export const QWEN_MODEL = process.env.QWEN_MODEL ?? "qwen3.7-plus";
const ATTEMPT_TIMEOUT_MS = 60_000;

export const qwenEnabled = () => Boolean(process.env.DASHSCOPE_API_KEY);

type Part = { text?: string; inlineData?: { mimeType: string; data: string } };

// Gemini-shaped parts (what gemini.ts builds) → OpenAI chat content.
const content = (parts: object[]) =>
  (parts as Part[]).map((p) =>
    p.inlineData
      ? { type: "image_url", image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` } }
      : { type: "text", text: p.text ?? "" },
  );

// json_schema holds the model to the shape; models that don't take it get json_object plus the
// schema in the prompt. Remember what worked, like gemini.ts does with thinking.
let schemaMode: "json_schema" | "json_object" = "json_schema";

/** One JSON answer from Qwen. Returns the raw text and the model that wrote it. */
export async function qwenJson(parts: object[], schema: object, temperature: number): Promise<{ text: string; modelVersion: string }> {
  for (;;) {
    const messages = [{ role: "user", content: content(parts) }];
    if (schemaMode === "json_object") {
      messages.unshift({ role: "system", content: [{ type: "text", text: `Answer with JSON only, matching this JSON Schema:\n${JSON.stringify(schema)}` }] });
    }
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages,
        temperature,
        // Like Gemini: thinking makes designs slower without making them better.
        enable_thinking: false,
        response_format:
          schemaMode === "json_schema" ? { type: "json_schema", json_schema: { name: "answer", schema } } : { type: "json_object" },
      }),
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    });
    const body = await res.text();
    if (!res.ok) {
      if (res.status === 400 && schemaMode === "json_schema" && /response_format|json_schema/i.test(body)) {
        schemaMode = "json_object";
        continue;
      }
      throw Object.assign(new Error(`qwen ${res.status}: ${body.slice(0, 300)}`), { status: res.status });
    }
    const json = JSON.parse(body) as { model?: string; choices?: { message?: { content?: string } }[] };
    // Some models wrap JSON in a ```json fence even when asked not to.
    const text = (json.choices?.[0]?.message?.content ?? "").replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, "");
    return { text, modelVersion: json.model ?? QWEN_MODEL };
  }
}
