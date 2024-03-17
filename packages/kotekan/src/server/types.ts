export type RenderingStrategy = "csr" | "ssr" | "jsx";

export type ServerProps = {
	mode?: RenderingStrategy;
	buildDir?: string;
	hostname?: string;
	port?: number;
	socket?: string;
	mdxEnabled?: boolean;
	development?: boolean;
};

export interface RouterProps {
	dir: string;
	mdxEnabled: boolean;
}
