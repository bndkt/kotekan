import clsx from "clsx";
import { forwardRef, type CSSProperties, useContext } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { TopLevelNavItem } from "./TopLevelNavItem";
import { Button } from "../../Button";
import { MobileSearch, Search } from "../search/Search";
import {
	MobileNavigation,
	useIsInsideMobileNavigation,
} from "../nav/MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";
import { LayoutContext } from "../LayoutContext";

export const Header = forwardRef<
	React.ElementRef<"div">,
	{ className?: string }
>(function Header({ className }, ref) {
	const { isOpen: mobileNavIsOpen } = useContext(LayoutContext);
	const isInsideMobileNavigation = useIsInsideMobileNavigation();

	const { scrollY } = useScroll();
	const bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
	const bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

	return (
		<motion.div
			ref={ref}
			className={clsx(
				className,
				"fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80",
				!isInsideMobileNavigation &&
					"backdrop-blur-sm lg:left-72 xl:left-80 dark:backdrop-blur",
				isInsideMobileNavigation
					? "bg-white dark:bg-zinc-900"
					: "bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]",
			)}
			style={
				{
					"--bg-opacity-light": bgOpacityLight,
					"--bg-opacity-dark": bgOpacityDark,
				} as CSSProperties
			}
		>
			<div
				className={clsx(
					"absolute inset-x-0 top-full h-px transition",
					(isInsideMobileNavigation || !mobileNavIsOpen) &&
						"bg-zinc-900/7.5 dark:bg-white/7.5",
				)}
			/>
			<Search />
			<div className="flex items-center gap-5 lg:hidden">
				<MobileNavigation />
				<a href="/" aria-label="Home" className="text-zinc-900 dark:text-white">
					🥁 Kotekan
				</a>
			</div>
			<div className="flex items-center gap-5">
				<nav className="hidden md:block">
					<ul className="flex items-center gap-8">
						<TopLevelNavItem href="/about">About</TopLevelNavItem>
						<TopLevelNavItem href="/docs">Docs</TopLevelNavItem>
						<TopLevelNavItem href="/demo">Demo</TopLevelNavItem>
					</ul>
				</nav>
				<div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
				<div className="flex gap-4">
					{/* <MobileSearch /> */}
					{/* <ThemeToggle /> */}
				</div>
				<div className="hidden min-[416px]:contents">
					<Button href="/quickstart">Try it</Button>
				</div>
			</div>
		</motion.div>
	);
});
