import Highlighter from "react-highlight-words";

export const HighlightQuery = ({
	text,
	query,
}: { text: string; query: string }) => {
	return (
		<Highlighter
			highlightClassName="underline bg-transparent text-emerald-500"
			searchWords={[query]}
			autoEscape={true}
			textToHighlight={text}
		/>
	);
};
