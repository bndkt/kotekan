export const SocialLink = ({
	href,
	icon: Icon,
	children,
}: {
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
}) => {
	return (
		<a href={href} className="group">
			<span className="sr-only">{children}</span>
			<Icon className="h-5 w-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500" />
		</a>
	);
};
