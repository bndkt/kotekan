import * as stylex from "@stylexjs/stylex";

import { Nav } from "../nav/Nav";

const styles = stylex.create({
	header: {
		display: "flex",
		position: "fixed",
		zIndex: 40,
	},
	left: {
		position: "fixed",
		width: "18rem",
		borderRightWidth: 1,
		borderColor: "rgba(24,24,27,.1)",
	},
	title: {
		fontFamily: "Arial, sans-serif",
		fontWeight: "normal",
		color: { default: "black", ":visited": "black" },
		textDecoration: "none",
	},
});

export const Header = () => {
	return (
		<header {...stylex.props(styles.header)}>
			<div {...stylex.props(styles.left)}>
				<h1 {...stylex.props(styles.title)}>
					<a href="/">Kotekan</a>
				</h1>
				<Nav />
			</div>
		</header>
	);
};
