import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";

import { Header } from "../header/Header";
import { Navigation } from "./Navigation";
import { motion } from "framer-motion";

export const MobileNavigationDialog = ({
	isOpen,
	close,
}: {
	isOpen: boolean;
	close: () => void;
}) => {
	const pathname = ""; // usePathname(); @todo
	const searchParams = ""; // useSearchParams(); @todo
	const initialPathname = useRef(pathname).current;
	const initialSearchParams = useRef(searchParams).current;

	useEffect(() => {
		if (pathname !== initialPathname || searchParams !== initialSearchParams) {
			close();
		}
	}, [pathname, searchParams, close, initialPathname, initialSearchParams]);

	function onClickDialog(event: React.MouseEvent<HTMLDivElement>) {
		if (!(event.target instanceof HTMLElement)) {
			return;
		}

		const link = event.target.closest("a");
		if (
			link &&
			link.pathname + link.search + link.hash ===
				window.location.pathname + window.location.search + window.location.hash
		) {
			close();
		}
	}

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog
				onClickCapture={onClickDialog}
				onClose={close}
				className="fixed inset-0 z-50 lg:hidden"
			>
				<Transition.Child
					as={Fragment}
					enter="duration-300 ease-out"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="duration-200 ease-in"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 top-14 bg-zinc-400/20 backdrop-blur-sm dark:bg-black/40" />
				</Transition.Child>

				<Dialog.Panel>
					<Transition.Child
						as={Fragment}
						enter="duration-300 ease-out"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="duration-200 ease-in"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Header />
					</Transition.Child>

					<Transition.Child
						as={Fragment}
						enter="duration-500 ease-in-out"
						enterFrom="-translate-x-full"
						enterTo="translate-x-0"
						leave="duration-500 ease-in-out"
						leaveFrom="translate-x-0"
						leaveTo="-translate-x-full"
					>
						<motion.div
							layoutScroll
							className="fixed bottom-0 left-0 top-14 w-full overflow-y-auto bg-white px-4 pb-4 pt-6 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/7.5 min-[416px]:max-w-sm sm:px-6 sm:pb-10 dark:bg-zinc-900 dark:ring-zinc-800"
						>
							<Navigation />
						</motion.div>
					</Transition.Child>
				</Dialog.Panel>
			</Dialog>
		</Transition.Root>
	);
};