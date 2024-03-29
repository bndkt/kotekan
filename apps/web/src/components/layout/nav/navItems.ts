export interface NavGroup {
	title: string;
	links: Array<{
		title: string;
		href: string;
	}>;
}

export const navItems: Array<NavGroup> = [
	{
		title: "Resources",
		links: [
			{ title: "Home", href: "/" },
			{ title: "About", href: "/about" },
			{ title: "Blog", href: "/blog" },
			{ title: "Docs", href: "/docs" },
		],
	},
	{
		title: "Demo",
		links: [
			{ title: "Overview", href: "/demo" },
			{ title: "Timestamp", href: "/demo/timestamp" },
			{ title: "Pokemon", href: "/demo/pokemon" },
		],
	},
];
