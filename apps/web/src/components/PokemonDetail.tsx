import path from "node:path";
import { Database } from "bun:sqlite";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

const db = new Database(
	path.join(process.env.PROJECT_ROOT as string, "data/veekun-pokedex.sqlite"),
);

const styles = css.create({
	green: {
		color: "green",
	},
});

export const PokemonDetail = async () => {
	const query = db.query(
		"SELECT identifier, base_experience FROM pokemon LIMIT 100",
	);

	const pokemon = query.get() as {
		identifier: string;
		base_experience: number;
	};

	return (
		<>
			<h.div style={styles.green}>Hello from the server!</h.div>
			<h.ul>
				<h.li>Name: {pokemon.identifier}</h.li>
				<h.li>Base experience: {pokemon.base_experience}</h.li>
			</h.ul>
		</>
	);
};
