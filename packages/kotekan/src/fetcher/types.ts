import type { FileSystemRouter } from "bun";

import type { BuildResult } from "../builder/types";
import type { RenderingStrategy } from "../server/types";

export interface ImportMap {
	imports: Record<string, string>;
}

export interface SsrFetcherProps {
	mode: RenderingStrategy;
	build: BuildResult;
	router: FileSystemRouter;
	buildPath: string;
	buildUrlSegment: string;
	jsxServer?: {
		hostname: string;
		port: string;
	};
	jsxSocket?: string;
	development?: boolean;
}

export interface JsxFetcherProps {
	mode: RenderingStrategy;
	build: BuildResult;
	router: FileSystemRouter;
	buildPath: string;
	buildUrlSegment: string;
	development?: boolean;
}
