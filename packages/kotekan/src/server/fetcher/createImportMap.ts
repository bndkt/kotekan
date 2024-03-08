export const createImportMap = (development?: boolean) => {
	const importMap = {
		imports: {
			react: "https://esm.sh/react@experimental?pin=v135".concat(
				development ? "&dev" : "",
			),
			"react/jsx-runtime":
				"https://esm.sh/react@experimental/jsx-runtime?pin=v135".concat(
					development ? "&dev" : "",
				),
			"react/jsx-dev-runtime":
				"https://esm.sh/react@experimental/jsx-dev-runtime?pin=v135".concat(
					development ? "&dev" : "",
				),
			"react-dom": "https://esm.sh/react-dom@experimental?pin=v135".concat(
				development ? "&dev" : "",
			),
			"react-dom/client":
				"https://esm.sh/react-dom@experimental/client?pin=v135".concat(
					development ? "&dev" : "",
				),
			"react-server-dom-esm/client":
				"/_build/modules/react-server-dom-esm/client",
		},
		// imports: {
		// 	react: "/_build/modules/react",
		// 	"react/jsx-runtime": "/_build/modules/jsx-runtime",
		// 	"react/jsx-dev-runtime": "/_build/modules/jsx-dev-runtime",
		// 	"react-dom": "/_build/modules/react-dom",
		// 	"react-dom/client": "/_build/modules/react-dom/client",
		// 	"react-server-dom-esm/client":
		// 		"/_build/modules/react-server-dom-esm/client",
		// },
	};

	return importMap;
};
