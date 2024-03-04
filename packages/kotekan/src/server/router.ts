interface RouterProps {
	dir: string;
	mdxEnabled: boolean;
}

export const router = ({ dir, mdxEnabled }: RouterProps) => {
	const fileExtensions = [".ts", ".tsx"];

	if (mdxEnabled) {
		fileExtensions.push(".md", ".mdx");
	}

	return new Bun.FileSystemRouter({
		style: "nextjs",
		dir,
		fileExtensions,
		// origin: "http://localhost:3000",
		// assetPrefix: "_kotekan/static/",
	});
};
