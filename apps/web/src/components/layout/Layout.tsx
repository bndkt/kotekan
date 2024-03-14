"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { LayoutContextProvider } from "./LayoutContext";
import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";
import { Navigation } from "./nav/Navigation";
import { HeroPattern } from "./HeroPattern";
import { SectionProvider } from "./sections/SectionProvider";
import { allSections } from "./sections/allSections";

export const Layout = ({
	children,
}: {
	children: ReactNode;
}) => {
	return (
		<LayoutContextProvider>
			<SectionProvider sections={allSections["/about"]}>
				<div className="h-full lg:ml-72 xl:ml-80">
					<motion.header
						layoutScroll
						className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
					>
						<div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 xl:w-80 lg:dark:border-white/10">
							<div className="hidden lg:flex">
								<a href="/" className="text-zinc-900 dark:text-white">
									🥁 Kotekan
								</a>
							</div>
							<Header />
							<Navigation className="hidden lg:mt-10 lg:block" />
						</div>
					</motion.header>
					<div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
						<HeroPattern />
						<main className="flex-auto">{children}</main>
						<Footer />
					</div>
				</div>
			</SectionProvider>
		</LayoutContextProvider>
	);
};
