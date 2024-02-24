import path from "node:path";

export const router = () => {
	const dir = path.dirname(Bun.resolveSync("./src/pages", process.cwd()));

	console.log({ dir });

	return new Bun.FileSystemRouter({
		style: "nextjs",
		dir,
		origin: "http://localhost:3000",
		assetPrefix: "_next/static/",
	});
};
