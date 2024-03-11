import { createContext, useState, type ReactNode } from "react";

export const LayoutContext = createContext<{
	isOpen: boolean;
	toggle: () => void;
	close: () => void;
}>({
	isOpen: false,
	toggle: () => {},
	close: () => {},
});

export const LayoutContextProvider = ({
	children,
}: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const close = () => setIsOpen(false);

	return (
		<LayoutContext.Provider value={{ isOpen, toggle, close }}>
			{children}
		</LayoutContext.Provider>
	);
};
