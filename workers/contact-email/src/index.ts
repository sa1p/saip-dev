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

const CRLF = "\r\n";

const toBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};

const encodeMimeHeader = (value: string) => {
  if (!/[^\x20-\x7e]/.test(value)) {
    return value;
  }
  const encoded = toBase64(value);
  const chunkSize = 52;
  const chunks = encoded.match(new RegExp(`.{1,${chunkSize}}`, "g")) ?? [
    encoded,
  ];
  return chunks.map((chunk) => `=?UTF-8?B?${chunk}?=`).join(`${CRLF} `);
};

const getDomainFromEmail = (value: string) => {
  const trimmed = value.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return "";
  }
  return trimmed.slice(atIndex + 1);
};

const createMessageId = (fromAddress: string) => {
  const domain = getDomainFromEmail(fromAddress) || "example.invalid";
  const id =
    typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `<${id}@${domain}>`;
};

const maskEmail = (value: string) => {
  const trimmed = value.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return "";
  }
  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  const localMasked =
    local.length <= 2
      ? `${local[0]}***`
      : `${local.slice(0, 2)}***${local.slice(-1)}`;
  const domainParts = domain.split(".");
  const domainLabel = domainParts[0] ?? "";
  const tld = domainParts.slice(1).join(".");
  const domainMasked = domainLabel
    ? `${domainLabel[0]}***${tld ? `.${tld}` : ""}`
    : `***${tld ? `.${tld}` : ""}`;
  return `${localMasked}@${domainMasked}`;
};

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

    const ip = normalize(payload.ip);
    const userAgent = normalize(payload.userAgent);
    const sentAt = normalize(payload.sentAt) || new Date().toISOString();

    try {
      const subjectText = singleLine(`New contact from ${name}`);
      const subject = encodeMimeHeader(subjectText);
      const messageId = createMessageId(env.CONTACT_FROM ?? "");
      const sentDate = new Date().toUTCString();
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
        "",
        `IP: ${ip}`,
        `User-Agent: ${userAgent}`,
        `Sent: ${sentAt}`,
      ].join(CRLF);

      const raw = [
        `Date: ${sentDate}`,
        `From: ${env.CONTACT_FROM}`,
        `To: ${env.CONTACT_TO}`,
        `Reply-To: ${email}`,
        `Message-ID: ${messageId}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        `Content-Type: text/plain; charset=\"UTF-8\"`,
        "Content-Transfer-Encoding: 8bit",
        "",
        body,
      ].join(CRLF);

      console.log("Contact email destination", {
        to: maskEmail(env.CONTACT_TO ?? ""),
        from: maskEmail(env.CONTACT_FROM ?? ""),
        replyTo: maskEmail(email),
      });

      const messageEmail = new EmailMessage(
        env.CONTACT_FROM,
        env.CONTACT_TO,
        raw
      );
      await env.CONTACT_EMAIL.send(messageEmail);
    } catch (error) {
      console.error("Contact email send failed.", error);
      return jsonResponse({ ok: false, error: "Send failed" }, 500);
    }

    return jsonResponse({ ok: true }, 200);
  },
};
