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
			{ title: "Pokemon", href: "/pokemon" },
			{ title: "Movies", href: "/movies" },
		],
	},
];
