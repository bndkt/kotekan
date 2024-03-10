import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

import { Header } from "./header/Header";
// import { Footer } from "./footer/Footer";

const styles = stylex.create({
	page: {
		marginLeft: "18rem",
		height: "100%",
	},
	main: {
		paddingHorizontal: "2rem",
		paddingTop: "3.5rem",
		flexDirection: "column",
		height: "100%",
		display: "flex",
		position: "relative",
	},
});

export const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div {...stylex.props(styles.page)}>
			<Header />
			<main {...stylex.props(styles.main)}>{children}</main>
		</div>
	);
};
