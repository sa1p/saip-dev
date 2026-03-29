import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

type TiltCardProps = {
	className?: string;
	children: ReactNode;
	intensity?: number;
};

export default function TiltCard({ className = "", children, intensity = 5 }: TiltCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const frame = useRef<number | null>(null);
	const baseStyle: CSSProperties = {
		"--rx": "0deg",
		"--ry": "0deg",
		"--hx": "50%",
		"--hy": "50%",
	};
	const baseClass =
		"relative [transform:perspective(1600px)_rotateX(var(--rx))_rotateY(var(--ry))] [transform-style:preserve-3d] transition-transform duration-200 after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:bg-[radial-gradient(180px_at_var(--hx)_var(--hy),rgba(47,111,95,0.05),transparent_70%)] after:opacity-0 after:transition-opacity hover:after:opacity-100 motion-reduce:transition-none motion-reduce:transform-none";

	const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
		if (event.pointerType !== "mouse") return;
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const rotateX = (y / rect.height - 0.5) * -intensity;
		const rotateY = (x / rect.width - 0.5) * intensity;
		const highlightX = (x / rect.width) * 100;
		const highlightY = (y / rect.height) * 100;

		if (frame.current) cancelAnimationFrame(frame.current);
		frame.current = requestAnimationFrame(() => {
			if (!ref.current) return;
			ref.current.style.setProperty("--rx", `${rotateX}deg`);
			ref.current.style.setProperty("--ry", `${rotateY}deg`);
			ref.current.style.setProperty("--hx", `${highlightX}%`);
			ref.current.style.setProperty("--hy", `${highlightY}%`);
		});
	};

	const handlePointerLeave = () => {
		if (!ref.current) return;
		ref.current.style.setProperty("--rx", "0deg");
		ref.current.style.setProperty("--ry", "0deg");
		ref.current.style.setProperty("--hx", "50%");
		ref.current.style.setProperty("--hy", "50%");
	};

	return (
		<div
			ref={ref}
			className={`${baseClass} ${className}`}
			style={baseStyle}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
		>
			{children}
		</div>
	);
}
