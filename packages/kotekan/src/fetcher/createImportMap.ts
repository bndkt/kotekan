import type { ImportMap } from "./types";

export const createImportMap = (development?: boolean): ImportMap => {
	const jsxRuntimeImport = development ? "jsx-dev-runtime" : "jsx-runtime";
	const reactVersion = "0.0.0-experimental-e373190fa-20240325";
	const queryString = `?pin=v135${development ? "&dev" : ""}`;

	const importMap: ImportMap = {
		imports: {
			react: `https://esm.sh/react@${reactVersion}?pin=v135${
				development ? "&dev" : ""
			}`,
			[`react/${jsxRuntimeImport}`]: `https://esm.sh/react@${reactVersion}/${jsxRuntimeImport}${queryString}`,
			"react-dom": `https://esm.sh/react-dom@${reactVersion}${queryString}`,
			"react-dom/client": `https://esm.sh/react-dom@${reactVersion}/client${queryString}`,
			"@physis/react-server-dom-esm/client": `/_build/modules/react-server-dom-esm/client${queryString}`,
		},
	};

	return importMap;
};
