import { navItems } from "./navItems";
import { Button } from "../../Button";
import { NavigationGroup } from "./NavigationGroup";
import { TopLevelNavItem } from "./TopLevelNavItem";

export const Navigation = () => {
	return (
		<nav className="hidden lg:mt-10 lg:block">
			<ul>
				<TopLevelNavItem href="/">API</TopLevelNavItem>
				<TopLevelNavItem href="#">Documentation</TopLevelNavItem>
				<TopLevelNavItem href="#">Support</TopLevelNavItem>
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
