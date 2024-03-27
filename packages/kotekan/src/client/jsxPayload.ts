declare global {
	interface Window {
		__JSX_PAYLOAD: string[];
	}
}

const encoder = new TextEncoder();

export const jsxPayloadStream = new ReadableStream({
	start(controller) {
		if (typeof window === "undefined") {
			return;
		}

		const handleChunk = (chunk: string) => {
			controller.enqueue(encoder.encode(chunk));
		};

		window.__JSX_PAYLOAD ||= [];
		window.__JSX_PAYLOAD.forEach(handleChunk);
		window.__JSX_PAYLOAD.push = (...items: string[]) => {
			for (const chunk of items) {
				handleChunk(chunk);
			}

			return window.__JSX_PAYLOAD.length;
		};

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				controller.close();
			});
		} else {
			controller.close();
		}
	},
});
