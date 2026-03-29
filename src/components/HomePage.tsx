import { Send } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import profileImage from "../assets/images/profile/saip-profile.jpg";
import lockScreenImage from "../assets/images/saip-chan/saip-chan-lock.jpg";
import phonePoster from "../assets/images/saip-chan/saip-chan-poster.jpg";
import saipChan01 from "../assets/videos/saip-chan/saip-chan-01.mp4";
import saipChan02 from "../assets/videos/saip-chan/saip-chan-02.mp4";
import saipChan03 from "../assets/videos/saip-chan/saip-chan-03.mp4";
import saipChan04 from "../assets/videos/saip-chan/saip-chan-04.mp4";
import saipChan05 from "../assets/videos/saip-chan/saip-chan-05.mp4";
import saipChan06 from "../assets/videos/saip-chan/saip-chan-06.mp4";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type StatusState = {
  message: string;
  type?: "success" | "error";
};

const phoneVideos = [
  saipChan01,
  saipChan02,
  saipChan03,
  saipChan04,
  saipChan05,
  saipChan06,
];

const YEAR = new Date().getFullYear();
const CHAT_STORAGE_KEY = "saip-chat-log";
const MAX_MESSAGE_LENGTH = 50;

const cardBaseClass =
  "rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6";
const cardSoftClass = `${cardBaseClass} bg-[var(--surface-soft)]`;
const cardTitleClass =
  "text-[1.2rem] font-semibold tracking-[0.01em] text-[var(--ink)]";
const cardDescClass = "mt-2 text-[0.92rem] leading-[1.6] text-[var(--muted)]";

const tagClass =
  "inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1 text-[0.72rem] text-[var(--muted)]";

const textLinkClass =
  "text-[0.82rem] text-[var(--ink)] underline decoration-[rgba(16,16,16,0.3)] underline-offset-[3px] transition-colors hover:text-[var(--accent)] hover:decoration-[rgba(47,111,95,0.6)]";
const actionLinkClass =
  "inline-flex items-center justify-center rounded-full border border-[var(--line)] px-5 py-3 text-[0.82rem] font-semibold tracking-[0.08em] font-[var(--font-display)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]";

export default function HomePage() {
  return (
    <main className="relative z-10 mx-auto flex flex-col max-w-6xl gap-14 px-6 pb-22 pt-18 md:gap-20 md:px-12 md:pb-28 md:pt-24">
      <HeroSection />
      <WorksSection />
      <footer className="text-center text-[0.8rem] text-(--muted)">
        &copy; {YEAR} saip.
      </footer>
    </main>
  );
}

function HeroSection() {
  return (
    <section className="grid items-center gap-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Reveal>
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-(--muted) font-semibold">
          AI Producer / Engineer
        </p>
        <h1 className="text-[clamp(2.4rem,3.4vw+1.6rem,4.4rem)] leading-[1.08] font-semibold">
          Designing the intersection of AI & Emotion.
        </h1>
        <p className="mt-4 max-w-136 text-[1.05rem] text-(--muted)">
          AI×エンタメの企画から実装、コミュニティまで。静かな熱量で体験を磨き上げます。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className={actionLinkClass} href="mailto:hello@tr1ppy.com">
            Contact
          </a>
          <a className={actionLinkClass} href="#works">
            View Works
          </a>
        </div>
        <div className="mt-5 grid gap-1.5 text-[0.95rem] text-(--muted)">
          <span>
            <strong className="font-semibold text-(--ink)">
              saip (さいぴ)
            </strong>{" "}
            / AI Producer
          </span>
          <span>Trippy Inc. / AI × Entertainment</span>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <PhoneMock />
      </Reveal>
    </section>
  );
}

function WorksSection() {
  return (
    <section id="works" className="grid gap-6">
      <Reveal delay={0.05}>
        <h2 className="text-[clamp(1.7rem,2.2vw+1rem,2.5rem)] tracking-[0.01em]">
          Works
        </h2>
      </Reveal>

      <div className="grid gap-4.5 md:grid-cols-2">
        <Reveal delay={0.05}>
          <div className={`${cardBaseClass} h-full`}>
            <h3 className={cardTitleClass}>saip (さいぴ)</h3>
            <p className={cardDescClass}>
              株式会社Trippy
              所属。「AI×エンタメ」領域のプロダクト開発において、企画・実装・コミュニティ運営を一気通貫で手がける。代表作『オズチャット
              -Oz
              Chat-』はユーザー数16万人を突破。LLMによるキャラクター対話や生成AIを活用したクリエイティブ制作を得意とする。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={tagClass}>AI Product</span>
              <span className={tagClass}>Full-Stack Dev</span>
              <span className={tagClass}>Generative AI</span>
              <span className={tagClass}>Community</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className={`${cardBaseClass} h-full`}>
            <div className="grid h-full content-between gap-5">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-(--line) bg-white">
                <img src={profileImage.src} alt="saip profile" loading="lazy" />
              </div>
              <div>
                <p className={cardTitleClass}>@_saip_</p>
                <p className={cardDescClass}>
                  AI×エンタメの企画・実装・発信を継続中。
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    className={textLinkClass}
                    href="https://x.com/_saip_"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X (DM)
                  </a>
                  <a className={textLinkClass} href="mailto:hello@tr1ppy.com">
                    Email
                  </a>
                  <a
                    className={textLinkClass}
                    href="https://tr1ppy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Company
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.15}>
          <a
            className={`block h-full ${cardSoftClass}`}
            href="https://0z.chat"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="オズチャット -Oz Chat- 公式サイト"
          >
            <div className="grid h-full gap-4">
              <h3 className={cardTitleClass}>オズチャット -Oz Chat-</h3>
              <p className={cardDescClass}>
                AIキャラクターと通話できる没入型チャットアプリ。感情表現と対話体験を拡張するプロダクトとして設計。
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <span className={tagClass}>AI Character Voice</span>
                <span className="text-[0.82rem] font-semibold text-(--accent)">
                  サイトを見る
                </span>
              </div>
            </div>
          </a>
        </Reveal>

        <Reveal delay={0.2}>
          <div className={`${cardBaseClass} h-full`}>
            <h3 className={cardTitleClass}>取り組み領域</h3>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl border border-(--line) bg-(--surface-soft) px-3.5 py-3 text-[0.82rem]">
                Product Strategy
              </div>
              <div className="rounded-2xl border border-(--line) bg-(--surface-soft) px-3.5 py-3 text-[0.82rem]">
                AI Experience
              </div>
              <div className="rounded-2xl border border-(--line) bg-(--surface-soft) px-3.5 py-3 text-[0.82rem]">
                Rapid Prototyping
              </div>
              <div className="rounded-2xl border border-(--line) bg-(--surface-soft) px-3.5 py-3 text-[0.82rem]">
                Community Growth
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className={`${cardBaseClass} h-full`}>
            <h3 className={cardTitleClass}>Manga & Creative</h3>
            <p className={cardDescClass}>
              AIとマンガ表現を融合させたコンテンツ発信。
            </p>
            <a
              className={`${textLinkClass} mt-3 inline-flex`}
              href="https://x.com/_saip_"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on X
            </a>
          </div>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.35}>
          <div id="contact" className={cardSoftClass}>
            <h3 className={cardTitleClass}>Contact</h3>
            <p className={cardDescClass}>依頼・取材・コラボレーションの連絡先。</p>
            <ContactForm />
            <div className="mt-4 flex flex-wrap gap-3 border-t border-(--line) pt-3">
              <a
                className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2.5 text-[0.78rem] uppercase tracking-[0.12em] font-(--font-display) text-(--ink) transition-colors hover:border-(--accent) hover:text-(--accent)"
                href="mailto:info@saip.dev"
              >
                Email
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2.5 text-[0.78rem] uppercase tracking-[0.12em] font-(--font-display) text-(--ink) transition-colors hover:border-(--accent) hover:text-(--accent)"
                href="https://x.com/_saip_"
                target="_blank"
                rel="noopener noreferrer"
              >
                X DM
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PhoneMock() {
  const volumeTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [powerOn, setPowerOn] = useState(true);
  const [volume, setVolume] = useState(60);
  const [showVolume, setShowVolume] = useState(false);

  const { timeText, dateText } = usePhoneClock();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let currentIndex = -1;

    const pickNextIndex = (total: number) => {
      if (total <= 1) return 0;
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * total);
      }
      return nextIndex;
    };

    const playNext = () => {
      currentIndex = pickNextIndex(phoneVideos.length);
      const nextSrc = phoneVideos[currentIndex];
      if (!nextSrc) return;
      video.src = nextSrc;
      video.load();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    video.addEventListener("ended", playNext);
    playNext();

    return () => {
      video.removeEventListener("ended", playNext);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (volumeTimerRef.current) {
        window.clearTimeout(volumeTimerRef.current);
      }
    };
  }, []);

  const updateVolume = (delta: number) => {
    setVolume((prev) => Math.min(100, Math.max(0, prev + delta)));
    setShowVolume(true);
    if (volumeTimerRef.current) {
      window.clearTimeout(volumeTimerRef.current);
    }
    volumeTimerRef.current = window.setTimeout(() => {
      setShowVolume(false);
    }, 900);
  };

  const togglePower = () => {
    setPowerOn((prev) => !prev);
  };

  const handleLockClick = () => {
    if (!powerOn) setPowerOn(true);
  };

  return (
    <div className="relative grid min-h-70 place-items-center">
      <div className="hero__grid" aria-hidden="true"></div>
      <div className={`hero__phone ${powerOn ? "" : "is-off"}`}>
        <div className="hero__phone-buttons" aria-hidden="true">
          <button
            className="hero__phone-button hero__phone-button--mute"
            type="button"
            aria-label="Mute toggle"
          ></button>
          <button
            className="hero__phone-button hero__phone-button--up"
            type="button"
            aria-label="Volume up"
            onClick={() => updateVolume(10)}
          ></button>
          <button
            className="hero__phone-button hero__phone-button--down"
            type="button"
            aria-label="Volume down"
            onClick={() => updateVolume(-10)}
          ></button>
        </div>
        <button
          className="hero__phone-button hero__phone-button--power"
          type="button"
          aria-label="Power"
          onClick={togglePower}
        ></button>
        <div className="hero__phone-shell">
          <div className="hero__phone-notch"></div>
          <div className="hero__phone-status">
            <span className="hero__phone-time">{timeText}</span>
            <span className="hero__phone-status-icons">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M2 18h2.5v-3H2v3Zm4.5 0H9v-6H6.5v6Zm4.5 0H13.5V7H11v11Zm4.5 0H18v-9h-2.5v9Zm4.5 0H23v-12h-2.5v12Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 4c2.5 0 4.7 1.2 6.2 3.1l-1.6 1.2C15.5 6.8 13.9 6 12 6s-3.5.8-4.6 2.3L5.8 7.1C7.3 5.2 9.5 4 12 4Zm0 6c1.4 0 2.7.7 3.5 1.8l-1.6 1.2c-.5-.7-1.2-1-1.9-1s-1.4.3-1.9 1l-1.6-1.2C9.3 10.7 10.6 10 12 10Zm0 6c.6 0 1.2.3 1.6.8l-1.6 1.2-1.6-1.2c.4-.5 1-.8 1.6-.8Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg viewBox="0 0 28 14" aria-hidden="true">
                <rect
                  x="1"
                  y="3"
                  width="22"
                  height="8"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                ></rect>
                <rect
                  x="3"
                  y="5"
                  width="14"
                  height="4"
                  rx="1"
                  fill="currentColor"
                ></rect>
                <rect
                  x="23"
                  y="5.5"
                  width="3"
                  height="3"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
          </div>
          <div className="hero__phone-screen">
            <video
              ref={videoRef}
              className="hero__phone-video"
              autoPlay
              muted
              playsInline
              poster={phonePoster.src}
              src={phoneVideos[0]}
            ></video>
            <div className="hero__phone-screen-overlay">
              <div
                className={`hero__phone-volume ${showVolume ? "is-visible" : ""}`}
                aria-hidden="true"
              >
                <div className="hero__phone-volume-bar">
                  <span
                    className="hero__phone-volume-fill"
                    style={{ height: `${volume}%` }}
                  ></span>
                </div>
              </div>
              <div className="hero__phone-bottom"></div>
            </div>
            <PhoneChat />
            <button
              className="hero__lock-screen"
              type="button"
              onClick={handleLockClick}
            >
              <img
                className="hero__lock-video"
                src={lockScreenImage.src}
                alt=""
                aria-hidden="true"
                decoding="async"
              />
              <div className="hero__lock-overlay">
                <span className="hero__lock-time">{timeText}</span>
                <span className="hero__lock-date">{dateText}</span>
                <span className="hero__lock-hint">Tap to unlock</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneChat() {
  const logRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const suppressOutputRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setMessages(
          parsed.filter(
            (item) => item && item.role && typeof item.content === "string"
          )
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, isAssistantLoading]);

  const saveMessages = (nextMessages: ChatMessage[]) => {
    try {
      const trimmed = nextMessages.slice(-12);
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmed));
    } catch {}
  };

  const getLastExchange = (items: ChatMessage[]) => {
    for (let i = items.length - 1; i >= 0; i -= 1) {
      if (items[i].role !== "assistant") continue;
      const assistant = items[i];
      for (let j = i - 1; j >= 0; j -= 1) {
        if (items[j].role === "user") {
          return { user: items[j].content, assistant: assistant.content };
        }
      }
      break;
    }
    return null;
  };

  const stripTrailingMetadataText = (text: string) => {
    const markers = ['{"tool_calls"', '{"response"', '{"usage"'];
    let cutIndex = -1;
    for (const marker of markers) {
      const idx = text.indexOf(marker);
      if (idx === -1) continue;
      if (cutIndex === -1 || idx < cutIndex) {
        cutIndex = idx;
      }
    }
    if (cutIndex === -1) return text;
    return text.slice(0, cutIndex).trimEnd();
  };

  const appendChunk = (chunkText: string) => {
    if (!chunkText || suppressOutputRef.current) return;
    const cleaned = stripTrailingMetadataText(chunkText);
    if (cleaned !== chunkText) {
      suppressOutputRef.current = true;
    }
    if (!cleaned) return;
    setIsAssistantLoading(false);
    setMessages((prev) => {
      if (!prev.length) return prev;
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.role !== "assistant") return prev;
      next[next.length - 1] = {
        ...last,
        content: `${last.content}${cleaned}`,
      };
      return next;
    });
  };

  const extractChunk = (raw: string) => {
    if (!raw || raw === "[DONE]") return "";
    const trimmed = raw.trim();
    if (
      trimmed.startsWith("$error:") ||
      trimmed.toLowerCase().startsWith("error:")
    ) {
      return "";
    }
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") return parsed;
      if (typeof parsed?.delta === "string") return parsed.delta;
      if (typeof parsed?.chunk === "string") return parsed.chunk;
      if (typeof parsed?.response === "string") return parsed.response;
      if (typeof parsed?.token === "string") return parsed.token;
      if (typeof parsed?.text === "string") return parsed.text;
      if (
        parsed &&
        typeof parsed === "object" &&
        ("response" in parsed ||
          "chunk" in parsed ||
          "token" in parsed ||
          "text" in parsed ||
          "usage" in parsed)
      ) {
        return "";
      }
      return raw;
    } catch {
      return raw;
    }
  };

  const parseEvent = (event: string) => {
    const lines = event.split(/\r?\n/);
    let eventType = "message";
    const dataLines: string[] = [];
    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventType = line.replace(/^event:\s*/, "").trim();
        continue;
      }
      if (line.startsWith("data:")) {
        dataLines.push(line.replace(/^data:\s*/, ""));
      }
    }
    return { eventType, data: dataLines.join("\n") };
  };

  const logStreamError = (payload: string, eventType?: string) => {
    if (!payload) return;
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(payload);
    } catch {}
    const parsedError =
      parsed && typeof parsed === "object"
        ? (parsed as { error?: string; response?: { error?: string } }).error ??
          (parsed as { response?: { error?: string } }).response?.error
        : null;
    const errorEvent = eventType && /error|failed/i.test(eventType);
    const errorString =
      payload.startsWith("$error:") ||
      payload.toLowerCase().startsWith("error:");
    if (!errorEvent && !parsedError && !errorString) return;
    console.error("[chat] stream error", {
      event: eventType,
      payload,
      parsed: parsed || undefined,
    });
  };

  const sendMessage = async (value: string) => {
    if (!value) return;
    if (value.length > MAX_MESSAGE_LENGTH) {
      setStatus(`メッセージは${MAX_MESSAGE_LENGTH}字以内で入力してください。`);
      return;
    }

    const history = getLastExchange(messages);
    const nextMessages = [
      ...messages,
      { role: "user", content: value } as ChatMessage,
      { role: "assistant", content: "" } as ChatMessage,
    ];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setIsAssistantLoading(true);
    setStatus("送信中...");
    suppressOutputRef.current = false;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          message: value,
          history: history ?? undefined,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text().catch(() => "");
        let data: { error?: string } = {};
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch {}
        throw new Error(data?.error ?? "送信に失敗しました。");
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/event-stream")) {
        const responseText = await response.text().catch(() => "");
        let data: { text?: string } = {};
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch {}
        const cleanedText = stripTrailingMetadataText(data?.text ?? "");
        const updatedMessages = nextMessages.map((item, index) =>
          index === nextMessages.length - 1
            ? { ...item, content: cleanedText }
            : item
        );
        setMessages(updatedMessages);
        setIsAssistantLoading(false);
        setStatus(cleanedText ? "" : "AIの応答が空でした。");
        saveMessages(updatedMessages);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("ストリームが開始できません。");
      }

      setStatus("応答中...");

      const decoder = new TextDecoder();
      let buffer = "";
      let rawStream = "";
      const maxRawLog = 2000;

      const flushEvents = (raw: string) => {
        const events = raw.split(/\r?\n\r?\n/);
        buffer = events.pop() ?? "";

        for (const event of events) {
          const { eventType, data } = parseEvent(event);
          if (data) {
            const textChunk = extractChunk(data);
            if (textChunk) {
              appendChunk(textChunk);
            } else {
              logStreamError(data, eventType);
            }
            continue;
          }

          const rawText = event.trim();
          if (!rawText) continue;
          const textChunk = extractChunk(rawText);
          if (textChunk) {
            appendChunk(textChunk);
          } else {
            logStreamError(rawText, eventType);
          }
        }
      };

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        const decoded = decoder.decode(chunk, { stream: true });
        if (rawStream.length < maxRawLog) {
          rawStream += decoded.slice(0, maxRawLog - rawStream.length);
        }
        buffer += decoded;
        flushEvents(buffer);
      }

      if (buffer) {
        flushEvents(`${buffer}\n\n`);
      }

      setIsAssistantLoading(false);
      setMessages((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role !== "assistant") return prev;
        const cleanedText = stripTrailingMetadataText(last.content);
        next[next.length - 1] = { ...last, content: cleanedText };
        saveMessages(next);
        return next;
      });

      if (!rawStream && !messages[messages.length - 1]?.content) {
        console.warn("[chat] stream ended without content", { raw: rawStream });
      }
      setStatus("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "送信に失敗しました。";
      console.error("[chat] request failed", error);
      setIsAssistantLoading(false);
      setStatus(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    await sendMessage(value);
  };

  return (
    <div className="hero__phone-chat">
      <div
        ref={logRef}
        className="hero__phone-chat-log grid min-h-30 max-h-47.5 gap-2 overflow-y-auto overflow-x-hidden"
      >
        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={`flex ${item.role === "user" ? "justify-end" : ""}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-2.5 py-2 whitespace-pre-wrap text-xs leading-[1.45] ${
                item.role === "user"
                  ? "bg-[#f4f2ec] text-[#101010]"
                  : "bg-white/15 text-[#f4f2ec]"
              } whitespace-pre-wrap wrap-break-word`}
            >
              {item.content}
            </div>
          </div>
        ))}
        {isAssistantLoading && (
          <div className="flex">
            <div className="flex items-center gap-1 rounded-2xl bg-white/15 px-3 py-2 text-[#f4f2ec]">
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-[chat-loading_1.2s_infinite_ease-in-out]"></span>
              <span
                className="h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-[chat-loading_1.2s_infinite_ease-in-out]"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-[chat-loading_1.2s_infinite_ease-in-out]"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>
        )}
      </div>
      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <input
          className="h-10 w-full rounded-xl border border-white/20 bg-black/70 px-3 text-[16px] text-[#f4f2ec] outline-none focus:border-white/35 focus:ring-2 focus:ring-white/20"
          name="message"
          type="text"
          placeholder="なんでも答えるよ"
          required
          maxLength={MAX_MESSAGE_LENGTH}
          inputMode="text"
          enterKeyHint="send"
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          className="rounded-full bg-[#f4f2ec] p-2 text-[10px] uppercase tracking-[0.08em] text-[#101010]"
          type="submit"
          disabled={isSending}
        >
          <Send className="size-4" />
        </button>
      </form>
      <span className="text-[10px] text-white/70">{status}</span>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<StatusState>({ message: "" });
  const [isSending, setIsSending] = useState(false);

  const setStatusMessage = (message: string, type?: "success" | "error") => {
    setStatus({ message, type });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSending(true);
    setStatusMessage("");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (response.ok) {
        setStatusMessage("送信しました。確認次第ご連絡します。", "success");
        form.reset();
      } else {
        setStatusMessage(
          data?.error ?? "送信に失敗しました。時間をおいて再度お試しください。",
          "error"
        );
      }
    } catch {
      setStatusMessage(
        "送信に失敗しました。時間をおいて再度お試しください。",
        "error"
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      className="mt-4 grid gap-3.5"
      method="POST"
      action="/api/contact"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[0.68rem] uppercase tracking-[0.18em] font-(--font-display) text-(--muted)">
            Name
          </span>
          <input
            className="w-full rounded-xl border border-(--line) bg-white px-3 py-2.5 text-[0.92rem] text-(--ink) outline-none focus:border-[rgba(47,111,95,0.45)] focus:ring-2 focus:ring-[rgba(47,111,95,0.2)]"
            type="text"
            name="name"
            autoComplete="name"
            required
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.68rem] uppercase tracking-[0.18em] font-(--font-display) text-(--muted)">
            Email
          </span>
          <input
            className="w-full rounded-xl border border-(--line) bg-white px-3 py-2.5 text-[0.92rem] text-(--ink) outline-none focus:border-[rgba(47,111,95,0.45)] focus:ring-2 focus:ring-[rgba(47,111,95,0.2)]"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
      </div>
      <label
        className="absolute -left-2499.75 h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <span>Website</span>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-[0.68rem] uppercase tracking-[0.18em] font-(--font-display) text-(--muted)">
          Message
        </span>
        <textarea
          className="min-h-30 w-full resize-y rounded-xl border border-(--line) bg-white px-3 py-2.5 text-[0.92rem] text-(--ink) outline-none focus:border-[rgba(47,111,95,0.45)] focus:ring-2 focus:ring-[rgba(47,111,95,0.2)]"
          name="message"
          rows={5}
          required
        ></textarea>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-(--ink) px-4 py-2.5 text-[0.78rem] uppercase tracking-[0.12em] font-(--font-display) text-white disabled:opacity-60"
          type="submit"
          disabled={isSending}
        >
          Send
        </button>
      </div>
      <p
        className={`min-h-[1.2em] text-[0.82rem] ${
          status.type === "success"
            ? "text-(--accent)"
            : status.type === "error"
            ? "text-[#b42318]"
            : "text-(--muted)"
        }`}
        role="status"
        aria-live="polite"
      >
        {status.message}
      </p>
    </form>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const shouldReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduceMotion(shouldReduce);

    if (shouldReduce || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setIsVisible(true);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`${className} ${
        reduceMotion ? "" : "transition duration-500 ease-out"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      {children}
    </div>
  );
}

function usePhoneClock() {
  const [timeText, setTimeText] = useState("09:41");
  const [dateText, setDateText] = useState("Mon, Jan 1");

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ja-JP", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    []
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const time = `${hours}:${minutes}`;
      setTimeText(time);
      setDateText(dateFormatter.format(now));
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, [dateFormatter]);

  return { timeText, dateText };
}
