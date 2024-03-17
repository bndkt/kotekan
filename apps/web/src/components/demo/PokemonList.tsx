import path from "node:path";
import { Database } from "bun:sqlite";

const dbPath = path.join(process.cwd(), "data", "veekun-pokedex.sqlite");
const db = new Database(dbPath);

export const PokemonList = async () => {
	const query = db.query("SELECT identifier FROM pokemon LIMIT 100");

	const pokemon = query.all() as { identifier: string }[];

	return (
		<>
			<ul>
				{pokemon.map((pokemon) => {
					return (
						<li key={pokemon.identifier}>
							<a href={`/demo/pokemon/${pokemon.identifier}`}>
								{pokemon.identifier.slice(0, 1).toUpperCase() +
									pokemon.identifier.slice(1)}
							</a>
						</li>
					);
				})}
			</ul>
		</>
	);
};
