import type { BuildArtifact } from "bun";

export interface BuilderProps {
	routes: Record<string, string>;
	buildPath?: string;
	development: boolean;
}

export interface BuildOutput {
	name: string;
	// path?: string;
	artifact?: BuildArtifact;
	contents?: string;
}

export interface BuildResult {
	// clientComponents: Record<string, BuildOutputFile>;
	renderScript: BuildOutput;
	hydrateScript: BuildOutput;
	clientBuildOutputs: Map<string, BuildOutput>;
}
