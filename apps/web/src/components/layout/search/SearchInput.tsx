import { forwardRef } from "react";
import type {
	AutocompleteApi,
	AutocompleteState,
} from "@algolia/autocomplete-core";
import clsx from "clsx";
import { SearchIcon } from "./SearchIcon";

export type Result = {
	url: string;
	title: string;
	pageTitle?: string;
};

export type EmptyObject = Record<string, never>;

export type Autocomplete = AutocompleteApi<
	Result,
	React.SyntheticEvent,
	React.MouseEvent,
	React.KeyboardEvent
>;

export const SearchInput = forwardRef<
	React.ElementRef<"input">,
	{
		autocomplete: Autocomplete;
		autocompleteState: AutocompleteState<Result> | EmptyObject;
		onClose: () => void;
	}
>(function SearchInput({ autocomplete, autocompleteState, onClose }, inputRef) {
	const inputProps = autocomplete.getInputProps({ inputElement: null });

	return (
		<div className="group relative flex h-12">
			<SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-zinc-500" />
			<input
				ref={inputRef}
				className={clsx(
					"flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none sm:text-sm dark:text-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden",
					autocompleteState.status === "stalled" ? "pr-11" : "pr-4",
				)}
				{...inputProps}
				onKeyDown={(event) => {
					if (
						event.key === "Escape" &&
						!autocompleteState.isOpen &&
						autocompleteState.query === ""
					) {
						// In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
						// bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
						if (document.activeElement instanceof HTMLElement) {
							document.activeElement.blur();
						}

						onClose();
					} else {
						inputProps.onKeyDown(event);
					}
				}}
			/>
			{autocompleteState.status === "stalled" && (
				<div className="absolute inset-y-0 right-3 flex items-center">
					<LoadingIcon className="h-5 w-5 animate-spin stroke-zinc-200 text-zinc-900 dark:stroke-zinc-800 dark:text-rose-400" />
				</div>
			)}
		</div>
	);
});
