import { useRef, type PointerEvent, type ReactNode } from "react";

type TiltCardProps = {
	className?: string;
	children: ReactNode;
	intensity?: number;
};

export default function TiltCard({ className = "", children, intensity = 5 }: TiltCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const frame = useRef<number | null>(null);

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
			className={`tilt-card ${className}`}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
		>
			{children}
		</div>
	);
}
