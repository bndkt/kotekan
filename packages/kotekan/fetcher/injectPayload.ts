// Adapted from https://github.com/reactwg/react-18/discussions/114
const injectLinks = new TransformStream({
	transform(chunk, controller) {
		// This should pick up any new link tags that hasn't been previously
		// written to this stream.
		let scriptTags = generateNewScriptTagsSinceLastCall();
		if (scriptTags) {
			// Write it before the HTML to ensure that the CSS is available and
			// blocks display before the HTML that shows it.
			controller.enqueue(textEncoder.encode(scriptTags));
		}
		// Finally write whatever React tried to write.
		controller.enqueue(chunk);
	},
});
readable.pipeThrough(injectLinks);
