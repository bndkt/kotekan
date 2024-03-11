import type { AutocompleteCollection } from "@algolia/autocomplete-core";

import type { Autocomplete, Result } from "./SearchInput";
import { SearchResult } from "./SearchResult";
import { NoResultsIcon } from "./NoResultsIcon";

export const SearchResults = ({
	autocomplete,
	query,
	collection,
}: {
	autocomplete: Autocomplete;
	query: string;
	collection: AutocompleteCollection<Result>;
}) => {
	if (collection.items.length === 0) {
		return (
			<div className="p-6 text-center">
				<NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600" />
				<p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
					Nothing found for{" "}
					<strong className="break-words font-semibold text-zinc-900 dark:text-white">
						&lsquo;{query}&rsquo;
					</strong>
					. Please try again.
				</p>
			</div>
		);
	}

	return (
		<ul {...autocomplete.getListProps()}>
			{collection.items.map((result, resultIndex) => (
				<SearchResult
					key={result.url}
					result={result}
					resultIndex={resultIndex}
					autocomplete={autocomplete}
					collection={collection}
					query={query}
				/>
			))}
		</ul>
	);
};
