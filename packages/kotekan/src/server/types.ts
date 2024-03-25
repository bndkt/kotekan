export type RenderingStrategy = "csr" | "ssr" | "jsx";

export type ServerProps = {
	buildDir?: string;
	buildUrlSegment?: string;
	stylexFilename?: string;
	hostname?: string;
	port?: number;
	mdxEnabled?: boolean;
	development?: boolean;
} & (
	| {
			mode?: Exclude<RenderingStrategy, "jsx">;
			jsxServer?: {
				hostname?: string;
				port?: number;
				socket?: string;
			};
			socket?: never;
	  }
	| {
			mode?: Extract<RenderingStrategy, "jsx">;
			jsxServer?: never;
			socket?: string;
	  }
);

export interface RouterProps {
	dir: string;
	mdxEnabled: boolean;
}
