import path from "node:path";
import { Database } from "bun:sqlite";
import * as stylex from "@stylexjs/stylex";

const db = new Database(
	path.join(process.env.PROJECT_ROOT as string, "data/veekun-pokedex.sqlite"),
);

const styles = stylex.create({
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
			<div {...stylex.props(styles.green)}>Hello from the server!</div>
			<ul>
				<li>Name: {pokemon.identifier}</li>
				<li>Base experience: {pokemon.base_experience}</li>
			</ul>
		</>
	);
};
