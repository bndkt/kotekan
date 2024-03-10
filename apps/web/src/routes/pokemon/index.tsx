import { Suspense } from "react";

import { PokemonList } from "../../components/PokemonList.tsx";

export default function Pokemon() {
	return (
		<>
			<title>Pokémon - Kotekan</title>
			<h1>Kotekan - Pokémon</h1>
			<a href="/">Home</a>
			<Suspense fallback={<div>Loading Pokémon &hellip;</div>}>
				{/* @ts-expect-error Async component */}
				<PokemonList />
			</Suspense>
		</>
	);
}
