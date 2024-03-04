export const router = (dir: string) => {
	return new Bun.FileSystemRouter({
		style: "nextjs",
		dir,
		fileExtensions: [".ts", ".tsx", ".md", ".mdx"],
		// origin: "http://localhost:3000",
		// assetPrefix: "_kotekan/static/",
	});
};
