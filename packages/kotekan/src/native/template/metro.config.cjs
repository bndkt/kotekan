const path = require("path");

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const projectRoot = path.join(__dirname);
const workspaceRoot = path.join(__dirname, "../../../../");

console.log({ projectRoot, workspaceRoot });

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
	projectRoot,
	watchFolders: [workspaceRoot],
	resolver: {
		nodeModulesPaths: [
			path.resolve(projectRoot, "../../node_modules"),
			path.resolve(workspaceRoot, "node_modules"),
		],
	},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
