import { EmailMessage } from "cloudflare:email";

type SendEmail = {
  send(message: EmailMessage): Promise<void>;
};

type Env = {
  CONTACT_EMAIL: SendEmail;
  CONTACT_FROM: string;
  CONTACT_TO: string;
  CONTACT_WORKER_TOKEN?: string;
};

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
  ip?: unknown;
  userAgent?: unknown;
  sentAt?: unknown;
};

const jsonResponse = (payload: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const parseJson = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }
  try {
    return (await request.json()) as ContactPayload;
  } catch {
    return null;
  }
};

export default {
  async fetch(request: Request, env: Env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const token = normalize(request.headers.get("x-contact-token"));
    const requiredToken = normalize(env.CONTACT_WORKER_TOKEN ?? "");
    if (requiredToken && token !== requiredToken) {
      return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
    }

    const payload = await parseJson(request);
    if (!payload) {
      return jsonResponse({ ok: false, error: "Invalid payload" }, 400);
    }

    const name = normalize(payload.name);
    const email = normalize(payload.email);
    const message = normalize(payload.message);
    const website = normalize(payload.website);

    if (website) {
      return jsonResponse({ ok: true }, 200);
    }

    if (!name || !email || !message) {
      return jsonResponse({ ok: false, error: "Missing required fields" }, 400);
    }

    if (!isEmail(email)) {
      return jsonResponse({ ok: false, error: "Invalid email" }, 400);
    }

    if (message.length > 2000) {
      return jsonResponse({ ok: false, error: "Message too long" }, 400);
    }

    if (!env.CONTACT_FROM || !env.CONTACT_TO) {
      return jsonResponse({ ok: false, error: "Email settings missing" }, 500);
    }

    const subject = singleLine(`New contact from ${name}`);
    const ip = normalize(payload.ip);
    const userAgent = normalize(payload.userAgent);
    const sentAt = normalize(payload.sentAt) || new Date().toISOString();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
      "",
      `IP: ${ip}`,
      `User-Agent: ${userAgent}`,
      `Sent: ${sentAt}`,
    ].join("\n");

    const raw = [
      `From: ${env.CONTACT_FROM}`,
      `To: ${env.CONTACT_TO}`,
      `Reply-To: ${email}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=\"UTF-8\"`,
      `Content-Transfer-Encoding: 8bit`,
      "",
      body,
    ].join("\n");

    const messageEmail = new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, raw);

    try {
      await env.CONTACT_EMAIL.send(messageEmail);
    } catch {
      return jsonResponse({ ok: false, error: "Send failed" }, 500);
    }

    return jsonResponse({ ok: true }, 200);
  },
};
