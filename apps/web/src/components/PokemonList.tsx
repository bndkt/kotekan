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

export const PokemonList = async () => {
	const query = db.query("SELECT identifier FROM pokemon LIMIT 100");

	const pokemon = query.all() as { identifier: string }[];

	return (
		<>
			<div {...stylex.props(styles.green)}>Hello from the server!</div>
			<ul>
				{pokemon.map((pokemon) => {
					return (
						<li key={pokemon.identifier}>
							<a href={`/pokemon/${pokemon.identifier}`}>
								{pokemon.identifier}
							</a>
						</li>
					);
				})}
			</ul>
		</>
	);
};
