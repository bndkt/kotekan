export const createImportMap = (development?: boolean) => {
	const jsxRuntimeImport = development ? "jsx-dev-runtime" : "jsx-runtime";
	const reactVersion = "0.0.0-experimental-338dddc08-20240307";
	const queryString = `?pin=v135${development ? "&dev" : ""}`;

	const importMap = {
		imports: {
			react: `https://esm.sh/react@${reactVersion}?pin=v135${
				development ? "&dev" : ""
			}`,
			[`react/${jsxRuntimeImport}`]: `https://esm.sh/react@${reactVersion}/${jsxRuntimeImport}${queryString}`,
			"react-dom": `https://esm.sh/react-dom@0.0.0-experimental-338dddc08-20240307${queryString}`,
			"react-dom/client": `https://esm.sh/react-dom@${reactVersion}/client${queryString}`,
			"react-server-dom-esm/client": `/_build/modules/react-server-dom-esm/client${queryString}`,
		},
	};

	return importMap;
};
