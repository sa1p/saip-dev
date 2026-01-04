import type { APIRoute } from "astro";

type Env = {
	CONTACT_WORKER_URL: string;
	CONTACT_WORKER_TOKEN?: string;
};

export const prerender = false;

const jsonResponse = (payload: Record<string, unknown>, status = 200) =>
	new Response(JSON.stringify(payload), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store",
		},
	});

const htmlResponse = (message: string, status = 200) =>
	new Response(
		`<!doctype html><html lang="ja"><meta charset="utf-8"><title>Contact</title><body style="font-family: sans-serif; padding: 32px;"><p>${message}</p><p><a href="/">Back to site</a></p></body></html>`,
		{
			status,
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				"Cache-Control": "no-store",
			},
		}
	);

const isEmail = (value: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalize = (value: unknown) =>
	typeof value === "string" ? value.trim() : "";

export const POST: APIRoute = async ({ request, locals }) => {
	const env = (locals.runtime?.env ?? {}) as Env;
	const accept = request.headers.get("accept") ?? "";
	const wantsJson = accept.includes("application/json");
	const contentType = request.headers.get("content-type") ?? "";

	let payload: Record<string, unknown> = {};
	if (contentType.includes("application/json")) {
		payload = (await request.json()) as Record<string, unknown>;
	} else {
		const form = await request.formData();
		payload = Object.fromEntries(form.entries());
	}

	const name = normalize(payload.name);
	const email = normalize(payload.email);
	const message = normalize(payload.message);
	const website = normalize(payload.website);

	if (website) {
		return wantsJson
			? jsonResponse({ ok: true }, 200)
			: htmlResponse("送信を受け付けました。", 200);
	}

	if (!name || !email || !message) {
		return wantsJson
			? jsonResponse({ ok: false, error: "必須項目を入力してください。" }, 400)
			: htmlResponse("必須項目を入力してください。", 400);
	}

	if (!isEmail(email)) {
		return wantsJson
			? jsonResponse({ ok: false, error: "メールアドレスを確認してください。" }, 400)
			: htmlResponse("メールアドレスを確認してください。", 400);
	}

	if (message.length > 2000) {
		return wantsJson
			? jsonResponse({ ok: false, error: "本文が長すぎます。" }, 400)
			: htmlResponse("本文が長すぎます。", 400);
	}

	const workerUrl = normalize(env.CONTACT_WORKER_URL);
	if (!workerUrl) {
		return wantsJson
			? jsonResponse({ ok: false, error: "送信設定が未設定です。" }, 500)
			: htmlResponse("送信設定が未設定です。", 500);
	}

	const ip = request.headers.get("cf-connecting-ip") ?? "";
	const userAgent = request.headers.get("user-agent") ?? "";
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};
	const workerToken = normalize(env.CONTACT_WORKER_TOKEN ?? "");
	if (workerToken) {
		headers["x-contact-token"] = workerToken;
	}

	try {
		const response = await fetch(workerUrl, {
			method: "POST",
			headers,
			body: JSON.stringify({
				name,
				email,
				message,
				website,
				ip,
				userAgent,
				sentAt: new Date().toISOString(),
			}),
		});

		if (!response.ok) {
			const data = (await response.json().catch(() => ({}))) as {
				error?: string;
			};
			throw new Error(data?.error ?? "送信に失敗しました。");
		}
	} catch {
		return wantsJson
			? jsonResponse({ ok: false, error: "送信に失敗しました。" }, 500)
			: htmlResponse("送信に失敗しました。", 500);
	}

	return wantsJson
		? jsonResponse({ ok: true }, 200)
		: htmlResponse("送信しました。折り返しご連絡します。", 200);
};

export const GET: APIRoute = () =>
	new Response("Method Not Allowed", { status: 405 });
