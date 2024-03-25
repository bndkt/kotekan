import { createElement, type FunctionComponent } from "react";
import { resolveSync } from "bun";

import type { CreateDocumentElementProps } from "./types";

export const createDocumentElement = async ({
	build,
	buildUrlSegment,
	stylexFilename,
	RouteComponent,
}: CreateDocumentElementProps) => {
	// StyleX
	const stylesBuildResult = build.clientBuildOutputs.get(`./${stylexFilename}`);

	const StyleXElement = stylesBuildResult
		? createElement("link", {
				href: `/${buildUrlSegment}/${stylexFilename}`,
				rel: "stylesheet",
				precedence: "default",
				key: "stylesheet",
			})
		: null;

	// const TailwindStylesheetElement = createElement("link", {
	// 	href: `/${buildUrlSegment}/styles.css`,
	// 	rel: "stylesheet",
	// 	precedence: "default",
	// 	key: "stylesheet",
	// });

	// Root component
	// const rootComponentFilePath = resolveSync("./src/Root", process.cwd()); // build.rootComponentFilePath
	const routeBuildOutput = build.serverBuildOutputs.get(
		resolveSync("./src/Root", process.cwd()),
	);
	if (
		!routeBuildOutput ||
		!routeBuildOutput.artifact ||
		!("path" in routeBuildOutput.artifact)
	) {
		throw new Error("🥁 Root component file not found");
	}
	const rootComponentFile = await import(routeBuildOutput.artifact.path);
	const RootComponent = rootComponentFile.default as FunctionComponent;

	// Route component element
	const RouteComponentElement = RouteComponent
		? createElement(RouteComponent, {
				key: "route",
			})
		: null;

	// Document element
	const DocumentElement = createElement(RootComponent, {}, [
		// TailwindStylesheetElement,
		StyleXElement,
		RouteComponentElement,
	]);

	return DocumentElement;
};
