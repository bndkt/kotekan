export const createImportMap = (development?: boolean) => {
	const importMap = {
		imports: {
			react:
				"https://esm.sh/react@0.0.0-experimental-338dddc08-20240307?pin=v135".concat(
					development ? "&dev" : "",
				),
			"react/jsx-runtime":
				"https://esm.sh/react@0.0.0-experimental-338dddc08-20240307/jsx-runtime?pin=v135".concat(
					development ? "&dev" : "",
				),
			"react/jsx-dev-runtime":
				"https://esm.sh/react@0.0.0-experimental-338dddc08-20240307/jsx-dev-runtime?pin=v135".concat(
					development ? "&dev" : "",
				),
			"react-dom":
				"https://esm.sh/react-dom@0.0.0-experimental-338dddc08-20240307?pin=v135".concat(
					development ? "&dev" : "",
				),
			"react-dom/":
				"https://esm.sh/react-dom@0.0.0-experimental-338dddc08-20240307&pin=v135"
					.concat(development ? "&dev" : "")
					.concat("/"),
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
