import type { FileSystemRouter } from "bun";

import type { RouterProps } from "./types";

export const router = ({ dir, mdxEnabled }: RouterProps): FileSystemRouter => {
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
