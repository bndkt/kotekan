"use client";
import { motion } from "framer-motion";

import { remToPx } from "../../lib/remToPx";
import type { NavGroup } from "./Navigation";

export const ActivePageMarker = ({
	group,
	pathname,
}: {
	group: NavGroup;
	pathname: string;
}) => {
	const itemHeight = remToPx(2);
	const offset = remToPx(0.25);
	const activePageIndex = group.links.findIndex(
		(link) => link.href === pathname,
	);
	const top = offset + activePageIndex * itemHeight;

	return (
		<motion.div
			layout
			className="absolute left-2 h-6 w-px bg-emerald-500"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { delay: 0.2 } }}
			exit={{ opacity: 0 }}
			style={{ top }}
		/>
	);
};
