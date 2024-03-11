import { Button } from "../../Button";

export const PageLink = ({
	label,
	page,
	previous = false,
}: {
	label: string;
	page: { href: string; title: string };
	previous?: boolean;
}) => {
	return (
		<>
			<Button
				href={page.href}
				aria-label={`${label}: ${page.title}`}
				variant="secondary"
				arrow={previous ? "left" : "right"}
			>
				{label}
			</Button>
			<a
				href={page.href}
				tabIndex={-1}
				// aria-hidden="true"
				className="text-base font-semibold text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
			>
				{page.title}
			</a>
		</>
	);
};
