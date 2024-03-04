/// <reference lib="dom" />
import { StrictMode, type ReactNode } from "react";
import { type Root } from "react-dom/client";
// @ts-expect-error Untyped import
import { createFromFetch } from "react-server-dom-esm/client";

export const setupNavigation = (root: Root) => {
	const navigate = (pathname: string) => {
		createFromFetch(fetch(`${pathname}?jsx`)).then((response: ReactNode) => {
			root.render(<StrictMode>{response}</StrictMode>);
		});
	};

	window.addEventListener(
		"click",
		(e: MouseEvent) => {
			const element = e.target as HTMLElement;

			// Only listen to link clicks.
			if (element.tagName !== "A") {
				return;
			}

			// Ignore "open in a new tab".
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
				return;
			}

			// Ignore external URLs.
			const href = element.getAttribute("href");
			if (!href || !href.startsWith("/")) {
				return;
			}

			// Prevent the browser from reloading the page but update the URL.
			e.preventDefault();
			window.history.pushState(null, "", href);

			// Call our custom logic.
			navigate(href);
		},
		true,
	);

	window.addEventListener("popstate", () => {
		// When the user presses Back/Forward, call our custom logic too.
		navigate(window.location.pathname);
	});
};
