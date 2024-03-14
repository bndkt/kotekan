import {
	createContext,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { useStore, type StoreApi } from "zustand";

import { createSectionStore } from "./createSectionStore";
import { useVisibleSections } from "./useVisibleSections";

export interface Section {
	id: string;
	title: string;
	offsetRem?: number;
	tag?: string;
	headingRef?: React.RefObject<HTMLHeadingElement>;
}

export interface SectionState {
	sections: Array<Section>;
	visibleSections: Array<string>;
	setVisibleSections: (visibleSections: Array<string>) => void;
	registerHeading: ({
		id,
		ref,
		offsetRem,
	}: {
		id: string;
		ref: React.RefObject<HTMLHeadingElement>;
		offsetRem: number;
	}) => void;
}

const SectionStoreContext = createContext<StoreApi<SectionState> | null>(null);

const useIsomorphicLayoutEffect =
	typeof window === "undefined" ? useEffect : useLayoutEffect;

export const SectionProvider = ({
	sections,
	children,
}: {
	sections: Array<Section>;
	children: React.ReactNode;
}) => {
	const [sectionStore] = useState(() => createSectionStore(sections));

	useVisibleSections(sectionStore);

	useIsomorphicLayoutEffect(() => {
		sectionStore.setState({ sections });
	}, [sectionStore, sections]);

	return (
		<SectionStoreContext.Provider value={sectionStore}>
			{children}
		</SectionStoreContext.Provider>
	);
};

export function useSectionStore<T>(selector: (state: SectionState) => T) {
	const store = useContext(SectionStoreContext);
	return useStore(store!, selector);
}
