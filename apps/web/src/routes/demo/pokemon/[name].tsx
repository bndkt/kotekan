import { Suspense } from "react";

import { Wrapper } from "@/components/content/Wrapper.tsx";
import { PokemonDetail } from "../../../components/demo/PokemonDetail.tsx";

export default function Pokemon() {
	return (
		<Wrapper>
			<title>Pokémon - Kotekan</title>
			<h1>Kotekan - Pokémon</h1>
			<a href="/demo/pokemon">All Pokémon</a>
			<Suspense fallback={<div>Loading Pokémon &hellip;</div>}>
				{/* @ts-expect-error Async component */}
				<PokemonDetail />
			</Suspense>
		</Wrapper>
	);
}
