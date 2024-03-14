import { createStore } from "zustand";

import type { Section, SectionState } from "./SectionProvider";

export const createSectionStore = (sections: Array<Section>) => {
	return createStore<SectionState>()((set) => ({
		sections,
		visibleSections: [],
		setVisibleSections: (visibleSections) =>
			set((state) =>
				state.visibleSections.join() === visibleSections.join()
					? {}
					: { visibleSections },
			),
		registerHeading: ({ id, ref, offsetRem }) =>
			set((state) => {
				return {
					sections: state.sections.map((section) => {
						if (section.id === id) {
							return {
								...section,
								headingRef: ref,
								offsetRem,
							};
						}
						return section;
					}),
				};
			}),
	}));
};
