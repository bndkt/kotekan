// "use server";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

const styles = css.create({
	green: {
		color: "green",
	},
});

export const PokemonList = async () => {
	const pokemonRequest = await fetch("https://pokeapi.co/api/v2/pokemon");
	const pokemon = (await pokemonRequest.json()) as {
		results: { name: string }[];
	};

	// console.log(pokemon.results);

	return (
		<>
			<h.div style={styles.green}>Hello from the server!</h.div>
			<h.ul>
				{pokemon.results.map((pokemon) => {
					return (
						<h.li>
							<h.a href={`/pokemon/${pokemon.name}`}>{pokemon.name}</h.a>
						</h.li>
					);
				})}
			</h.ul>
		</>
	);
};
