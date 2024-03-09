import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	blue: {
		color: { default: "blue", ":visited": "red" },
	},
});

export const Header = () => {
	return (
		<header>
			<h1 {...stylex.props(styles.blue)}>Kotekan</h1>
		</header>
	);
};
