import type { FileSystemRouter } from "bun";

import type { BuildResult } from "../builder/types";
import type { RenderingStrategy } from "../server/types";
import type { FunctionComponent } from "react";

export interface ImportMap {
	imports: Record<string, string>;
}

export interface SsrFetcherProps {
	mode: RenderingStrategy;
	build: BuildResult;
	router: FileSystemRouter;
	buildPath: string;
	buildUrlSegment: string;
	stylexFilename: string;
	jsxServer: {
		hostname: string;
		port: number;
		socket?: string;
	};
	development?: boolean;
}

export interface JsxFetcherProps {
	build: BuildResult;
	router: FileSystemRouter;
	buildUrlSegment: string;
	stylexFilename: string;
}

export interface CreateDocumentElementProps {
	build: BuildResult;
	buildUrlSegment: string;
	stylexFilename: string;
	RouteComponent?: FunctionComponent;
}
