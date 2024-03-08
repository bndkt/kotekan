// import { Suspense } from "react";
// // @ts-expect-error Missing types
// import { css, html as h } from "react-strict-dom";

// import { PokemonDetail } from "../../components/PokemonDetail.tsx";

// const styles = css.create({
// 	orange: {
// 		color: "orange",
// 	},
// });

// export default function Pokemon() {
// 	return (
// 		<>
// 			<title>Pokémon - Kotekan</title>
// 			<h.h1 style={styles.orange}>Kotekan - Pokémon</h.h1>
// 			<h.a href="/pokemon">All Pokémon</h.a>
// 			<Suspense fallback={<h.div>Loading Pokémon &hellip;</h.div>}>
// 				{/* @ts-expect-error Async component */}
// 				<PokemonDetail />
// 			</Suspense>
// 		</>
// 	);
// }
