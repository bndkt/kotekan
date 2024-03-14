"use client";
import { useRef } from "react";
import { motion, useIsPresent } from "framer-motion";

import { remToPx } from "../../../lib/remToPx";
import type { NavGroup } from "../nav/navItems";
import { useSectionStore } from "./SectionProvider";
import { useIsInsideMobileNavigation } from "../nav/MobileNavigation";

export function useInitialValue<T>(value: T, condition = true) {
	const initialValue = useRef(value).current;
	return condition ? initialValue : value;
}

export const VisibleSectionHighlight = ({
	group,
	pathname,
}: {
	group: NavGroup;
	pathname: string;
}) => {
	const [sections, visibleSections] = useInitialValue(
		[
			useSectionStore((s) => s.sections),
			useSectionStore((s) => s.visibleSections),
		],
		useIsInsideMobileNavigation(),
	);

	const isPresent = useIsPresent();
	const firstVisibleSectionIndex = Math.max(
		0,
		[{ id: "_top" }, ...sections].findIndex(
			(section) => section.id === visibleSections[0],
		),
	);
	const itemHeight = remToPx(2);
	const height = isPresent
		? Math.max(1, visibleSections.length) * itemHeight
		: itemHeight;
	const top =
		group.links.findIndex((link) => link.href === pathname) * itemHeight +
		firstVisibleSectionIndex * itemHeight;

	return (
		<motion.div
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { delay: 0.2 } }}
			exit={{ opacity: 0 }}
			className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
			style={{ borderRadius: 8, height, top }}
		/>
	);
};
