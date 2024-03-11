const InfoIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
			<circle cx="8" cy="8" r="8" strokeWidth="0" />
			<path
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M6.75 7.75h1.5v3.5"
			/>
			<circle cx="8" cy="4" r=".5" fill="none" />
		</svg>
	);
};

export const Note = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-50/50 p-4 leading-6 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/5 dark:text-rose-200 dark:[--tw-prose-links-hover:theme(colors.emerald.300)] dark:[--tw-prose-links:theme(colors.white)]">
			<InfoIcon className="mt-1 h-4 w-4 flex-none fill-rose-500 stroke-white dark:fill-rose-200/20 dark:stroke-rose-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
				{children}
			</div>
		</div>
	);
};
