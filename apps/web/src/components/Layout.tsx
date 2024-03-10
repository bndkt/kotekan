import type { ReactNode } from "react";

import { Header } from "./header/Header";
// import { Footer } from "./footer/Footer";

export const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Header />
			<main>{children}</main>
		</div>
	);
};
