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
		updateOffset((offsetX / rect.width) * strength, (offsetY / rect.height) * strength);
	};

	const handlePointerLeave = () => updateOffset(0, 0);

	return (
		<a
			ref={ref}
			href={href}
			className="magnetic-btn"
			data-variant={variant}
			target={target}
			rel={target === "_blank" ? rel ?? "noopener noreferrer" : rel}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
		>
			<span className="magnetic-btn__label">{label}</span>
		</a>
	);
}
