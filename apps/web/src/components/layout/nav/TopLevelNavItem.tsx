import type { ReactNode } from "react";

export const TopLevelNavItem = ({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) => {
	return (
		<li className="md:hidden">
			<a
				href={href}
				className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
			>
				{children}
			</a>
		</li>
	);
};
