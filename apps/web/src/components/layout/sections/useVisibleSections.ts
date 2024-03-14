import { useEffect } from "react";
import { type StoreApi, useStore } from "zustand";

import { remToPx } from "../../../lib/remToPx";
import type { SectionState } from "./SectionProvider";

export const useVisibleSections = (sectionStore: StoreApi<SectionState>) => {
	const setVisibleSections = useStore(
		sectionStore,
		(s) => s.setVisibleSections,
	);
	const sections = useStore(sectionStore, (s) => s.sections);

	useEffect(() => {
		function checkVisibleSections() {
			const { innerHeight, scrollY } = window;
			const newVisibleSections = [];

			for (
				let sectionIndex = 0;
				sectionIndex < sections.length;
				sectionIndex++
			) {
				const { id, headingRef, offsetRem = 0 } = sections[sectionIndex];

				if (!headingRef?.current) {
					continue;
				}

				const offset = remToPx(offsetRem);
				const top = headingRef.current.getBoundingClientRect().top + scrollY;

				if (sectionIndex === 0 && top - offset > scrollY) {
					newVisibleSections.push("_top");
				}

				const nextSection = sections[sectionIndex + 1];
				const bottom =
					(nextSection?.headingRef?.current?.getBoundingClientRect().top ??
						Infinity) +
					scrollY -
					remToPx(nextSection?.offsetRem ?? 0);

				if (
					(top > scrollY && top < scrollY + innerHeight) ||
					(bottom > scrollY && bottom < scrollY + innerHeight) ||
					(top <= scrollY && bottom >= scrollY + innerHeight)
				) {
					newVisibleSections.push(id);
				}
			}

			setVisibleSections(newVisibleSections);
		}

		const raf = window.requestAnimationFrame(() => checkVisibleSections());
		window.addEventListener("scroll", checkVisibleSections, { passive: true });
		window.addEventListener("resize", checkVisibleSections);

		return () => {
			window.cancelAnimationFrame(raf);
			window.removeEventListener("scroll", checkVisibleSections);
			window.removeEventListener("resize", checkVisibleSections);
		};
	}, [setVisibleSections, sections]);
};
