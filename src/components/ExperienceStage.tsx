import { useRef, useState, type PointerEvent, type ReactNode } from "react";

/** The artwork responds locally; it never submits a chat message. */
export default function ExperienceStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const moveLight = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty("--light-x", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 24}px`);
    ref.current?.style.setProperty("--light-y", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 24}px`);
  };

  return (
    <div className={`experience-stage ${paused ? "is-paused" : ""}`} ref={ref}
      onPointerMove={moveLight} onPointerLeave={() => {
        ref.current?.style.setProperty("--light-x", "0px");
        ref.current?.style.setProperty("--light-y", "0px");
      }}>
      <div className="experience-art" aria-hidden="true">
        <div className="experience-glow" />
        <div className="experience-orbit experience-orbit--one" />
        <div className="experience-orbit experience-orbit--two" />
        <span className="experience-coordinate">AI</span>
        <span className="experience-coordinate experience-coordinate--emotion">EMOTION</span>
      </div>
      <div className="experience-caption"><span /> INTERACTIVE EXPERIENCE</div>
      {children}
      <div className="experience-bottom">
        <p>画面の中の彼女に、話しかけてみて。</p>
        <button type="button" className="experience-pause" aria-pressed={paused}
          aria-label="背景のアニメーションを停止" onClick={() => setPaused(!paused)}>
          {paused ? "再生 ↗" : "一時停止 Ⅱ"}
        </button>
      </div>
    </div>
  );
}
