import type { APIRoute } from "astro";

type AiRunOptions = {
  gateway?: {
    id: string;
  };
};

type AiBinding = {
  run: (
    model: string,
    input: Record<string, unknown>,
    options?: AiRunOptions
  ) => Promise<unknown>;
};

type Env = {
  AI: AiBinding;
  AI_GATEWAY_ID?: string;
  AI_MODEL?: string;
};

type ChatPayload = {
  message?: string;
  history?: {
    user?: string;
    assistant?: string;
  };
};

export const prerender = false;

const MAX_MESSAGE_LENGTH = 50;
const SYSTEM_PROMPT = [
  "あなたは「さいぴちゃん」（saip氏のにじげんのすがた）として話します。",
  "かわいくておとなしげな女の子をロールプレイし、丁寧でやさしい口調で答えてください。",
  "返答は必ず日本語で3〜5文にしてください。",
  "メタ情報やJSONは出力せず、本文のみを返してください。",
].join("\n");

const jsonResponse = (payload: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const readJson = async (request: Request) => {
  try {
    return (await request.json()) as ChatPayload;
  } catch {
    return {};
  }
};

const extractText = (result: unknown) => {
  if (!result) return "";
  if (typeof result === "string") return result;
  if (typeof result === "object" && "output_text" in result) {
    const outputText = (result as { output_text?: unknown }).output_text;
    return typeof outputText === "string"
      ? outputText
      : JSON.stringify(outputText);
  }
  if (typeof result === "object" && "response" in result) {
    const response = (result as { response?: unknown }).response;
    return typeof response === "string" ? response : JSON.stringify(response);
  }
  return JSON.stringify(result);
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals.runtime?.env ?? {}) as unknown as Env;
  const payload = await readJson(request);
  const message = normalize(payload.message);
  const lastUser = normalize(payload.history?.user);
  const lastAssistant = normalize(payload.history?.assistant);

  if (!message) {
    return jsonResponse(
      { ok: false, error: "メッセージを入力してください。" },
      400
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      {
        ok: false,
        error: `メッセージは${MAX_MESSAGE_LENGTH}字以内で入力してください。`,
      },
      400
    );
  }

  if (!env.AI) {
    console.error("[chat] AI binding missing");
    return jsonResponse({ ok: false, error: "AI設定が未設定です。" }, 500);
  }

  const messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [{ role: "system", content: SYSTEM_PROMPT }];
  if (lastUser && lastAssistant) {
    messages.push({ role: "user", content: lastUser });
    messages.push({ role: "assistant", content: lastAssistant });
  }
  messages.push({ role: "user", content: message });

  const model = env.AI_MODEL?.trim() || "@cf/meta/llama-3.1-8b-instruct";
  const gatewayId = env.AI_GATEWAY_ID?.trim();
  const options: AiRunOptions | undefined = gatewayId
    ? { gateway: { id: gatewayId } }
    : undefined;
  const usesResponsesApi = model.startsWith("@cf/openai/gpt-oss-");

  let aiStream: unknown;
  try {
    const input = usesResponsesApi
			? {
					input: messages.map((entry) => ({
						role: entry.role,
						content: entry.content,
					})),
					tool_choice: "none",
					stream: true,
					max_output_tokens: 400,
				}
      : {
          messages,
          stream: true,
          max_tokens: 400,
        };
    aiStream = await env.AI.run(model, input, options);
  } catch (error) {
    console.error("[chat] AI stream failed", error);
    return jsonResponse(
      { ok: false, error: "AIへの接続に失敗しました。" },
      502
    );
  }

  const streamBody =
    aiStream instanceof Response
      ? aiStream.body
      : (aiStream as ReadableStream | null);

  if (!streamBody || typeof streamBody.getReader !== "function") {
    try {
      const input = usesResponsesApi
			? {
					input: messages.map((entry) => ({
						role: entry.role,
						content: entry.content,
					})),
					tool_choice: "none",
					max_output_tokens: 400,
				}
        : {
            messages,
            max_tokens: 400,
          };
      const result = await env.AI.run(model, input, options);
      const text = extractText(result);
      return jsonResponse({ ok: true, text }, 200);
    } catch (error) {
      console.error("[chat] AI non-stream failed", error);
      return jsonResponse(
        { ok: false, error: "AI応答の取得に失敗しました。" },
        502
      );
    }
  }

  return new Response(streamBody, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    },
  });
};

export const GET: APIRoute = () =>
  new Response("Method Not Allowed", { status: 405 });
