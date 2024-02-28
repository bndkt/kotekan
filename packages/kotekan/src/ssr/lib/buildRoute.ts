import { resolveSync } from "bun";
import { createBuildFile } from "./createBuildFile";

const appFilePath = resolveSync("./../../client/App.tsx", import.meta.dir);
const hydrateFilePath = resolveSync("./../../client/hydrate", import.meta.dir);
const renderFilePath = resolveSync("./../../client/render", import.meta.dir);

type BuildProps = {
	location: string;
	target: "server" | "client";
	mode: "render" | "hydrate";
	development?: boolean;
};

const build = async (props: BuildProps) => {
	const entrypoint =
		props.target === "server"
			? appFilePath
			: props.mode === "render"
			  ? renderFilePath
			  : hydrateFilePath;
	const target = props.target === "server" ? "bun" : "browser";
	const external =
		props.target === "server" ? ["react", "react-dom"] : undefined;
	const sourcemap = props.development ? "inline" : "none";
	const minify = props.development ? false : true;

	const build = await Bun.build({
		entrypoints: [entrypoint],
		// root: process.cwd(),
		target,
		sourcemap,
		minify,
		// naming: "[name]-[hash].[ext]",
		// outdir: hydrate ? "./build" : undefined,
		external,
		define: {
			"process.env.RENDER": JSON.stringify(props.mode === "hydrate"),
			"process.env.LOCATION": JSON.stringify(props.location),
		},
	});

	if (!build.success || build.outputs.length === 0) {
		throw new Error("Build failed or no outputs");
	}

	return build.outputs[0];
};

interface BuildRouteProps {
	name: string;
	location: string;
	buildPath: string;
	ssrEnabled: boolean;
	development?: boolean;
}

export const buildRoute = async ({
	name,
	location,
	buildPath,
	ssrEnabled,
	development,
}: BuildRouteProps) => {
	let csrBuildFilePath: string | undefined;

	// SSR/SSG
	const ssrBuildArtifact = await build({
		location,
		target: "server",
		mode: "hydrate",
		development,
	});
	const { filePath: ssrBuildFilePath } = await createBuildFile({
		name: `${name}-ssr`,
		buildPath,
		buildArtifact: ssrBuildArtifact,
	});

	// CSR
	if (!ssrEnabled) {
		const csrBuildArtifact = await build({
			location,
			target: "server",
			mode: "render",
			development,
		});
		const csrBuildFile = await createBuildFile({
			name: `${name}-csr`,
			buildPath,
			buildArtifact: csrBuildArtifact,
		});
		csrBuildFilePath = csrBuildFile.filePath;
	}

	// Boostrap (for either SSR or CSR)
	const bootstrapBuildArtifact = await build({
		location,
		target: "client",
		mode: ssrEnabled ? "hydrate" : "render",
		development,
	});

	const { fileName: bootstrapBuildFileName } = await createBuildFile({
		name: `${name}-bootstrap`,
		buildPath,
		buildArtifact: bootstrapBuildArtifact,
	});

	return {
		ssrBuildFilePath,
		csrBuildFilePath,
		bootstrapBuildFileName,
	};
};
