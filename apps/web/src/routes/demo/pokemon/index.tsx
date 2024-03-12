import { Suspense } from "react";

import { Wrapper } from "@/components/content/Wrapper.tsx";
import { PokemonList } from "../../../components/demo/PokemonList.tsx";

export default function Pokemon() {
	return (
		<Wrapper>
			<title>Pokémon - Kotekan</title>
			<h1>Kotekan - Pokémon</h1>
			<a href="/">Home</a>
			<Suspense fallback={<div>Loading Pokémon &hellip;</div>}>
				{/* @ts-expect-error Async component */}
				<PokemonList />
			</Suspense>
		</Wrapper>
	);
}
