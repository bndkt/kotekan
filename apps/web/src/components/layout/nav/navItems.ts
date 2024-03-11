export interface NavGroup {
	title: string;
	links: Array<{
		title: string;
		href: string;
	}>;
}

export const navItems: Array<NavGroup> = [
	{
		title: "Demo",
		links: [
			{ title: "Home", href: "/" },
			{ title: "About", href: "/about" },
			{ title: "Docs", href: "/docs" },
			{ title: "Pokemon", href: "/pokemon" },
			{ title: "Movies", href: "/movies" },
		],
	},
	{
		title: "Resources",
		links: [
			{ title: "Contacts", href: "/contacts" },
			{ title: "Conversations", href: "/conversations" },
			{ title: "Messages", href: "/messages" },
			{ title: "Groups", href: "/groups" },
			{ title: "Attachments", href: "/attachments" },
		],
	},
];
