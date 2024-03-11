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
			{ title: "Docs", href: "/docs" },
		],
	},
	{
		title: "Demo",
		links: [
			{ title: "Timestamp", href: "/demo/timestamp" },
			{ title: "Pokemon", href: "/demo/pokemon" },
		],
	},
];
