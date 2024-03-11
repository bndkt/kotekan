import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useRef } from "react";

import { SearchInput } from "./SearchInput";

export const SearchDialog = ({
	open,
	setOpen,
	className,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	className?: string;
}) => {
	const formRef = useRef<React.ElementRef<"form">>(null);
	const panelRef = useRef<React.ElementRef<"div">>(null);
	const inputRef = useRef<React.ElementRef<typeof SearchInput>>(null);
	// const { autocomplete, autocompleteState } = useAutocomplete({
	//   close() {
	//     setOpen(false)
	//   },
	// })
	const pathname = ""; // usePathname() @todo
	const searchParams = ""; // useSearchParams() @todo

	useEffect(() => {
		setOpen(false);
	}, [pathname, searchParams, setOpen]);

	useEffect(() => {
		if (open) {
			return;
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setOpen(true);
			}
		}

		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, setOpen]);

	return (
		<Transition.Root
			show={open}
			as={Fragment}
			// afterLeave={() => autocomplete.setQuery("")} // @todo
		>
			<Dialog
				onClose={setOpen}
				className={clsx("fixed inset-0 z-50", className)}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<Dialog.Panel className="mx-auto transform-gpu overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 sm:max-w-xl dark:bg-zinc-900 dark:ring-zinc-800">
							{/* <div {...autocomplete.getRootProps({})}>
								<form
									ref={formRef}
									{...autocomplete.getFormProps({
										inputElement: inputRef.current,
									})}
								>
									<SearchInput
										ref={inputRef}
										autocomplete={autocomplete}
										autocompleteState={autocompleteState}
										onClose={() => setOpen(false)}
									/>
									<div
										ref={panelRef}
										className="border-t border-zinc-200 bg-white empty:hidden dark:border-zinc-100/5 dark:bg-white/2.5"
										{...autocomplete.getPanelProps({})}
									>
										{autocompleteState.isOpen && (
											<SearchResults
												autocomplete={autocomplete}
												query={autocompleteState.query}
												collection={autocompleteState.collections[0]}
											/>
										)}
									</div>
								</form>
										</div> */}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};
