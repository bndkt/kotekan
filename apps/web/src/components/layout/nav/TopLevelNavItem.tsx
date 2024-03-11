import type { ReactNode } from "react";

export const TopLevelNavItem = ({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) => {
	return (
		<li>
			<a
				href={href}
				className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
			>
				{children}
			</a>
		</li>
	);
};
