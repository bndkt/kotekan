export const tsconfigJson = () => {
	const tsconfigJson = {
		types: ["@types/bun", "react/canary"],
		compilerOptions: {
			// Enable latest features
			lib: ["ESNext"],
			target: "ESNext",
			module: "ESNext",
			moduleDetection: "force",
			jsx: "react-jsx",
			allowJs: true,

			// Bundler mode
			moduleResolution: "bundler",
			allowImportingTsExtensions: true,
			verbatimModuleSyntax: true,
			noEmit: true,

			// Best practices
			strict: true,
			skipLibCheck: true,
			noFallthroughCasesInSwitch: true,

			// Some stricter flags (disabled by default)
			noUnusedLocals: false,
			noUnusedParameters: false,
			noPropertyAccessFromIndexSignature: false,

			// Custom
			paths: {
				"@/components/*": ["./src/components/*"],
			},
		},
	};

	return tsconfigJson;
};
