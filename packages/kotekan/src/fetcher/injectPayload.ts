// Adapted from https://github.com/reactwg/react-18/discussions/114
// and https://github.com/devongovett/rsc-html-stream

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const trailer = "</body></html>";

export const injectPayload = (jsxStream: ReadableStream<Uint8Array>) => {
	return new TransformStream({
		async transform(chunk, controller) {
			let buf = decoder.decode(chunk);
			if (buf.endsWith(trailer)) {
				buf = buf.slice(0, -trailer.length);
			}
			controller.enqueue(encoder.encode(buf));

			// @ts-expect-error ReadableStream is in fact async iterable
			for await (const chunk of jsxStream) {
				const payload = JSON.stringify(decoder.decode(chunk, { stream: true }));
				controller.enqueue(
					encoder.encode(
						`<script>${escapeScript(
							`(self.__JSX_PAYLOAD||=[]).push(${payload})`,
						)}</script>`,
					),
				);
			}
		},
		async flush(controller) {
			controller.enqueue(encoder.encode(trailer));
		},
	});
};

// https://www.w3.org/TR/html52/semantics-scripting.html#restrictions-for-contents-of-script-elements
function escapeScript(script: string) {
	return script.replace(/<!--/g, "<\\!--").replace(/<\/(script)/gi, "</\\$1");
}
