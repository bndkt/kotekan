"use client";
import clsx from "clsx";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";

import type { NavGroup } from "./navItems";
import { NavLink } from "./NavLink";
import { ActivePageMarker } from "./ActivePageMarker";
import { VisibleSectionHighlight } from "./VisibleSectionHighlight";

export const NavigationGroup = ({
	group,
	className,
}: {
	group: NavGroup;
	className?: string;
}) => {
	// If this is the mobile navigation then we always render the initial
	// state, so that the state does not change during the close animation.
	// The state will still update when we re-open (re-render) the navigation.
	// let isInsideMobileNavigation = useIsInsideMobileNavigation();
	const isInsideMobileNavigation = false;
	// let [pathname, sections] = useInitialValue(
	// 	[usePathname(), useSectionStore((s) => s.sections)],
	// 	isInsideMobileNavigation,
	// );
	const sections = []; // @todo
	const pathname = ""; // @todo

	// let isActiveGroup = group.links.findIndex((link) => link.href === pathname) !== -1;
	const isActiveGroup = false; // @todo

	return (
		<li className={clsx("relative mt-6", className)}>
			<motion.h2
				layout="position"
				className="text-xs font-semibold text-zinc-900 dark:text-white"
			>
				{group.title}
			</motion.h2>
			<div className="relative mt-3 pl-2">
				<AnimatePresence initial={!isInsideMobileNavigation}>
					{isActiveGroup && (
						<VisibleSectionHighlight group={group} pathname={pathname} />
					)}
				</AnimatePresence>
				<motion.div
					layout
					className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
				/>
				<AnimatePresence initial={false}>
					{isActiveGroup && (
						<ActivePageMarker group={group} pathname={pathname} />
					)}
				</AnimatePresence>
				<ul className="border-l border-transparent">
					{group.links.map((link) => (
						<motion.li key={link.href} layout="position" className="relative">
							<NavLink href={link.href} active={link.href === pathname}>
								{link.title}
							</NavLink>
							<AnimatePresence mode="popLayout" initial={false}>
								{link.href === pathname && sections.length > 0 && (
									<motion.ul
										role="list"
										initial={{ opacity: 0 }}
										animate={{
											opacity: 1,
											transition: { delay: 0.1 },
										}}
										exit={{
											opacity: 0,
											transition: { duration: 0.15 },
										}}
									>
										{sections.map((section) => (
											<li key={section.id}>
												<NavLink
													href={`${link.href}#${section.id}`}
													tag={section.tag}
													isAnchorLink
												>
													{section.title}
												</NavLink>
											</li>
										))}
									</motion.ul>
								)}
							</AnimatePresence>
						</motion.li>
					))}
				</ul>
			</div>
		</li>
	);
};
