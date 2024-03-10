import path from "node:path";
import { createElement, type FunctionComponent } from "react";

import type { BuildResult } from "../src/builder";
import { resolveSync } from "bun";

interface CreateDocumentElementProps {
	// build: BuildResult;
	buildUrlSegment: string;
	RouteComponent?: FunctionComponent;
}

export const createDocumentElement = async ({
	// build,
	buildUrlSegment,
	RouteComponent,
}: CreateDocumentElementProps) => {
	// StyleX
	// const href = `/${buildUrlSegment}/styles/${build.stylesheetFileName}`;
	// const StylesheetElement = build.stylesheetFileName
	// 	? createElement("link", {
	// 			href,
	// 			rel: "stylesheet",
	// 			precedence: "default",
	// 			key: "stylesheet",
	// 	  })
	// 	: null;

	const TailwindStylesheetElement = createElement("link", {
		href: `/${buildUrlSegment}/styles.css`,
		rel: "stylesheet",
		precedence: "default",
		key: "stylesheet",
	});

	// Root component
	const rootComponentFilePath = resolveSync("./src/Root", process.cwd()); // build.rootComponentFilePath
	const rootComponentFile = await import(rootComponentFilePath);
	const RootComponent = rootComponentFile.default as FunctionComponent;

	// Route component element
	const RouteComponentElement = RouteComponent
		? createElement(RouteComponent, {
				key: "route",
		  })
		: null;

	// Document element
	const DocumentElement = createElement(RootComponent, {}, [
		TailwindStylesheetElement,
		RouteComponentElement,
	]);

	return DocumentElement;
};
