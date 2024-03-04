import { createElement, type FunctionComponent } from "react";

import type { BuildResult } from "../builder";

interface CreateDocumentElementProps {
	build: BuildResult;
	buildUrlSegment: string;
	RouteComponent?: FunctionComponent;
}

export const createDocumentElement = async ({
	build,
	buildUrlSegment,
	RouteComponent,
}: CreateDocumentElementProps) => {
	// StyleX
	const href = `/${buildUrlSegment}/styles/${build.stylesheetFileName}`;
	const StylesheetElement = createElement("link", {
		href,
		rel: "stylesheet",
		precedence: "default",
		key: "stylesheet",
	});

	// Root component
	const rootComponentFile = await import(build.rootComponentFilePath);
	const RootComponent = rootComponentFile.default as FunctionComponent;

	// Route component element
	const RouteComponentElement = RouteComponent
		? createElement(RouteComponent, {
				key: "route",
		  })
		: null;

	// Document element
	const DocumentElement = createElement(RootComponent, {}, [
		StylesheetElement,
		RouteComponentElement,
	]);

	return DocumentElement;
};