import type { BuildArtifact, BunFile } from "bun";

export interface BuilderProps {
	routes: Record<string, string>;
	buildPath?: string;
	development: boolean;
}

export interface BuildOutput {
	name: string;
	artifact?: BuildArtifact | BunFile;
}

export type BuildOutputsMap = Map<string, BuildOutput>;

export interface BuildResult {
	serverBuildOutputs: BuildOutputsMap;
	clientBuildOutputs: BuildOutputsMap;
	renderScript: BuildOutput;
	hydrateScript: BuildOutput;
}
