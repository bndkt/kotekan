import { Suspense } from "react";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

const styles = css.create({
	red: {
		color: "red",
	},
});

export default function Index() {
	return (
		<>
			<title>Kotekan</title>
			<h.p>Hello, world!</h.p>
		</>
	);
}
