import { Suspense } from "react";
import * as stylex from "@stylexjs/stylex";

import { PokemonDetail } from "../../components/PokemonDetail.tsx";

const styles = stylex.create({
	orange: {
		color: "orange",
	},
});

export default function Pokemon() {
	return (
		<>
			<title>Pokémon - Kotekan</title>
			<h1 {...stylex.props(styles.orange)}>Kotekan - Pokémon</h1>
			<a href="/pokemon">All Pokémon</a>
			<Suspense fallback={<div>Loading Pokémon &hellip;</div>}>
				{/* @ts-expect-error Async component */}
				<PokemonDetail />
			</Suspense>
		</>
	);
}
