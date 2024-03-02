import { Suspense } from "react";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

import { PokemonList } from "../components/PokemonList.tsx";

const styles = css.create({
	orange: {
		color: "orange",
	},
});

export default function Pokenmon() {
	return (
		<>
			<h.h1 style={styles.orange}>Kotekan - Pokémon</h.h1>
			<h.a href="/">Home</h.a>
			<Suspense fallback={<h.div>Loading Pokémon &hellip;</h.div>}>
				{/* @ts-expect-error Async component */}
				<PokemonList />
			</Suspense>
		</>
	);
}
