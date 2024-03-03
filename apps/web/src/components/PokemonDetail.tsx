// "use server";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

const styles = css.create({
	green: {
		color: "green",
	},
});

export const PokemonDetail = async () => {
	const pokemonRequest = await fetch(
		"https://pokeapi.co/api/v2/pokemon/bulbasaur",
	);
	const pokemon = (await pokemonRequest.json()) as {
		name: string;
		base_experience: number;
	};

	return (
		<>
			<h.div style={styles.green}>Hello from the server!</h.div>
			<h.ul>
				<h.li>Name: {pokemon.name}</h.li>
				<h.li>Base experience: {pokemon.base_experience}</h.li>
			</h.ul>
		</>
	);
};
