import { Suspense } from "react";

import { PokemonDetail } from "../../components/PokemonDetail.tsx";

export default function Pokemon() {
	return (
		<>
			<title>Pokémon - Kotekan</title>
			<h1>Kotekan - Pokémon</h1>
			<a href="/pokemon">All Pokémon</a>
			<Suspense fallback={<div>Loading Pokémon &hellip;</div>}>
				{/* @ts-expect-error Async component */}
				<PokemonDetail />
			</Suspense>
		</>
	);
}
