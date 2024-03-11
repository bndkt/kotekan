import type { AutocompleteCollection } from "@algolia/autocomplete-core";
import { Fragment, useId } from "react";
import clsx from "clsx";

import type { Autocomplete, Result } from "./SearchInput";
import { HighlightQuery } from "./HighlightQuery";

export const SearchResult = ({
	result,
	resultIndex,
	autocomplete,
	collection,
	query,
}: {
	result: Result;
	resultIndex: number;
	autocomplete: Autocomplete;
	collection: AutocompleteCollection<Result>;
	query: string;
}) => {
	const id = useId();

	const sectionTitle = navigation.find((section) =>
		section.links.find((link) => link.href === result.url.split("#")[0]),
	)?.title;
	const hierarchy = [sectionTitle, result.pageTitle].filter(
		(x): x is string => typeof x === "string",
	);

	return (
		<li
			className={clsx(
				"group block cursor-default px-4 py-3 aria-selected:bg-zinc-50 dark:aria-selected:bg-zinc-800/50",
				resultIndex > 0 && "border-t border-zinc-100 dark:border-zinc-800",
			)}
			aria-labelledby={`${id}-hierarchy ${id}-title`}
			{...autocomplete.getItemProps({
				item: result,
				source: collection.source,
			})}
		>
			<div
				id={`${id}-title`}
				aria-hidden="true"
				className="text-sm font-medium text-zinc-900 group-aria-selected:text-emerald-500 dark:text-white"
			>
				<HighlightQuery text={result.title} query={query} />
			</div>
			{hierarchy.length > 0 && (
				<div
					id={`${id}-hierarchy`}
					aria-hidden="true"
					className="mt-1 truncate whitespace-nowrap text-2xs text-zinc-500"
				>
					{hierarchy.map((item, itemIndex, items) => (
						<Fragment key={itemIndex}>
							<HighlightQuery text={item} query={query} />
							<span
								className={
									itemIndex === items.length - 1
										? "sr-only"
										: "mx-2 text-zinc-300 dark:text-zinc-700"
								}
							>
								/
							</span>
						</Fragment>
					))}
				</div>
			)}
		</li>
	);
};
