import { navItems } from "./navItems";
import { Button } from "../../Button";
import { NavigationGroup } from "./NavigationGroup";
import { TopLevelNavItem } from "./TopLevelNavItem";

export const Navigation = (props: React.ComponentPropsWithoutRef<"nav">) => {
	return (
		<nav {...props}>
			<ul>
				<TopLevelNavItem href="/api">API</TopLevelNavItem>
				<TopLevelNavItem href="/docs">Documentation</TopLevelNavItem>
				<TopLevelNavItem href="/support">Support</TopLevelNavItem>
				{navItems.map((group, groupIndex) => (
					<NavigationGroup
						key={group.title}
						group={group}
						className={groupIndex === 0 ? "md:mt-0" : ""}
					/>
				))}
				<li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
					<Button href="/" variant="filled" className="w-full">
						Try it
					</Button>
				</li>
			</ul>
		</nav>
	);
};
