import path from "node:path";

export const router = (dir: string) => {
	return new Bun.FileSystemRouter({
		style: "nextjs",
		dir,
		// origin: "http://localhost:3000",
		// assetPrefix: "_kotekan/static/",
	});
};
