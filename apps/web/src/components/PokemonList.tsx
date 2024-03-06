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

export const PokemonList = async () => {
	const query = db.query("SELECT identifier FROM pokemon LIMIT 100");

	const pokemon = query.all() as { identifier: string }[];

	return (
		<>
			<h.div style={styles.green}>Hello from the server!</h.div>
			<h.ul>
				{pokemon.map((pokemon) => {
					return (
						<h.li key={pokemon.identifier}>
							<h.a href={`/pokemon/${pokemon.identifier}`}>
								{pokemon.identifier}
							</h.a>
						</h.li>
					);
				})}
			</h.ul>
		</>
	);
};
