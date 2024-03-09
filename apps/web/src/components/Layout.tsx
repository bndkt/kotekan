import type { ReactNode } from "react";

import { Nav } from "./nav/Nav";
import { Header } from "./header/Header";
// import { Footer } from "./footer/Footer";

export const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<header>
				<Header />
				<Nav />
			</header>
			<main>{children}</main>
		</>
	);
};
