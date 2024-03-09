import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { Nav } from "./nav/Nav";

const styles = stylex.create({
	blue: {
		color: { default: "blue", ":visited": "red" },
	},
});

export const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<h1 {...stylex.props(styles.blue)}>Kotekan</h1>
			<Nav />
			{children}
		</div>
	);
};
