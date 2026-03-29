import { useRef, type PointerEvent } from "react";

type MagneticButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "ghost";
  target?: "_blank" | "_self";
  rel?: string;
};

export default function MagneticButton({
  href,
  label,
  variant = "primary",
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const baseStyle = { "--mx": "0px", "--my": "0px" } as React.CSSProperties;
  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-full border px-[18px] py-3 text-[0.85rem] font-semibold tracking-[0.1em] transition-[transform,box-shadow,background,border-color,color] duration-200 [transform:translate(var(--mx),var(--my))] font-[var(--font-display)] motion-reduce:transition-none motion-reduce:transform-none";
  const variantClass =
    variant === "ghost"
      ? "border-[var(--line)] bg-transparent text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      : "border-[var(--ink)] bg-[var(--ink)] text-white shadow-[0_8px_18px_rgba(16,16,16,0.08)] hover:border-[var(--accent)] hover:bg-[var(--accent)]";

  const updateOffset = (x: number, y: number) => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mx", `${x}px`);
    ref.current.style.setProperty("--my", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const strength = 8;
    updateOffset(
      (offsetX / rect.width) * strength,
      (offsetY / rect.height) * strength
    );
  };

  const handlePointerLeave = () => updateOffset(0, 0);

  return (
    <a
      ref={ref}
      href={href}
      className={`${baseClass} ${variantClass}`}
      style={baseStyle}
      target={target}
      rel={target === "_blank" ? rel ?? "noopener noreferrer" : rel}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="transform-[translate(calc(var(--mx)*-0.3),calc(var(--my)*-0.3))] transition-transform">
        {label}
      </span>
    </a>
  );
}
