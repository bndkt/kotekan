import { Button } from "../../Button";
import { NavigationGroup } from "./NavigationGroup";
import { TopLevelNavItem } from "./TopLevelNavItem";

export interface NavGroup {
	title: string;
	links: Array<{
		title: string;
		href: string;
	}>;
}

export const navigation: Array<NavGroup> = [
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

export const Navigation = () => {
	return (
		<nav className="hidden lg:mt-10 lg:block">
			<ul>
				<TopLevelNavItem href="/">API</TopLevelNavItem>
				<TopLevelNavItem href="#">Documentation</TopLevelNavItem>
				<TopLevelNavItem href="#">Support</TopLevelNavItem>
				{navigation.map((group, groupIndex) => (
					<NavigationGroup
						key={group.title}
						group={group}
						className={groupIndex === 0 ? "md:mt-0" : ""}
					/>
				))}
				<li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
					<Button href="#" variant="filled" className="w-full">
						Sign in
					</Button>
				</li>
			</ul>
		</nav>
	);
};
