"use client";

import { createContext, Suspense, useContext } from "react";

import { LayoutContext } from "../LayoutContext";
import { XIcon } from "./XIcon";
import { MenuIcon } from "./MenuIcon";
import { MobileNavigationDialog } from "./MobileNavigationDialog";

const IsInsideMobileNavigationContext = createContext(false);

export function useIsInsideMobileNavigation() {
	return useContext(IsInsideMobileNavigationContext);
}

// export const useMobileNavigationStore = create<{
// 	isOpen: boolean;
// 	open: () => void;
// 	close: () => void;
// 	toggle: () => void;
// }>()((set) => ({
// 	isOpen: false,
// 	open: () => set({ isOpen: true }),
// 	close: () => set({ isOpen: false }),
// 	toggle: () => set((state) => ({ isOpen: !state.isOpen })),
// }));

export function MobileNavigation() {
	const isInsideMobileNavigation = useIsInsideMobileNavigation();
	// const { isOpen, toggle, close } = useMobileNavigationStore();
	const { isOpen, toggle, close } = useContext(LayoutContext);
	const ToggleIcon = isOpen ? XIcon : MenuIcon;

	return (
		<IsInsideMobileNavigationContext.Provider value={true}>
			<button
				type="button"
				className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
				aria-label="Toggle navigation"
				onClick={toggle}
			>
				<ToggleIcon className="w-2.5 stroke-zinc-900 dark:stroke-white" />
			</button>
			{!isInsideMobileNavigation && (
				<Suspense fallback={null}>
					<MobileNavigationDialog isOpen={isOpen} close={close} />
				</Suspense>
			)}
		</IsInsideMobileNavigationContext.Provider>
	);
}
