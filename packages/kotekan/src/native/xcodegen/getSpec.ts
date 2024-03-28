export const getSpec = () => {
	const targetName = "KotekanApp";
	const testTargetName = `${targetName}Tests`;
	const bundleIdentifier = "dev.kotekan.app";

	const settingGroups = {
		base: {
			// LIBRARY_SEARCH_PATHS: [
			// 	'"$(inherited)"',
			// 	'"$(SDKROOT)/usr/lib/swift"',
			// 	'"$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)"',
			// ],
			// OTHER_LDFLAGS: ["$(inherited)", "-ObjC", "-lc++"],
			CURRENT_PROJECT_VERSION: 1,
			MARKETING_VERSION: "1.0",
			PRODUCT_BUNDLE_IDENTIFIER: bundleIdentifier,
		},
	};

	const commonTargetOptions = {
		supportedDestinations: ["iOS"],
	};

	const target = {
		...commonTargetOptions,
		type: "application",
		deploymentTarget: {
			iOS: "13.4",
		},
		// sources: [
		// 	{ path: "KotekanApp/Images.xcassets" },
		// 	{
		// 		path: "KotekanApp/AppDelegate.h",
		// 	},
		// 	{ path: "KotekanApp/AppDelegate.mm" },
		// 	{ path: "KotekanApp/Info.plist" },
		// 	{ path: "KotekanApp/LaunchScreen.storyboard" },
		// 	{ path: "KotekanApp/main.m" },
		// ],
		sources: [
			targetName,
			{
				path: "/System/Library/Frameworks/JavaScriptCore.framework",
				buildPhase: "none",
			},
		],
		testTarget: `${targetName}Tests`,
		preBuildScripts: [
			{
				name: "[CP] Check Pods Manifest.lock",
				inputFiles: [
					"${PODS_PODFILE_DIR_PATH}/Podfile.lock",
					"${PODS_ROOT}/Manifest.lock",
				],
				outputFiles: [
					"$(DERIVED_FILE_DIR)/Pods-KotekanApp-checkManifestLockResult.txt",
				],
				script:
					'diff "${PODS_PODFILE_DIR_PATH}/Podfile.lock" "${PODS_ROOT}/Manifest.lock" > /dev/null\nif [ $? != 0 ] ; then\n    # print error to STDERR\n    echo "error: The sandbox is not in sync with the Podfile.lock. Run \'pod install\' or update your CocoaPods installation." >&2\n    exit 1\nfi\n# This output is used by Xcode \'outputs\' to avoid re-running this script phase.\necho "SUCCESS" > "${SCRIPT_OUTPUT_FILE_0}"\n',
			},
		],
		postBuildScripts: [
			{
				name: "Bundle React Native code and images",
				// inputPaths: ["$(SRCROOT)/.xcode.env.local", "$(SRCROOT)/.xcode.env"],
				script:
					'set -e\n\nWITH_ENVIRONMENT="$REACT_NATIVE_PATH/scripts/xcode/with-environment.sh"\nREACT_NATIVE_XCODE="$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"\n\n/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"\n',
				inputFiles: ["$(SRCROOT)/.xcode.env.local", "$(SRCROOT)/.xcode.env"],
			},
			{
				name: "[CP] Embed Pods Frameworks",
				script:
					'"${PODS_ROOT}/Target Support Files/Pods-KotekanApp/Pods-KotekanApp-frameworks.sh"\n',
				inputFileLists: [
					"${PODS_ROOT}/Target Support Files/Pods-KotekanApp/Pods-KotekanApp-frameworks-${CONFIGURATION}-input-files.xcfilelist",
				],
				outputFileLists: [
					"${PODS_ROOT}/Target Support Files/Pods-KotekanApp/Pods-KotekanApp-frameworks-${CONFIGURATION}-output-files.xcfilelist",
				],
			},
			{
				name: "[CP] Copy Pods Resources",
				inputFileLists: [
					"${PODS_ROOT}/Target Support Files/Pods-KotekanApp/Pods-KotekanApp-resources-${CONFIGURATION}-input-files.xcfilelist",
				],
				outputFileLists: [
					"${PODS_ROOT}/Target Support Files/Pods-KotekanApp/Pods-KotekanApp-resources-${CONFIGURATION}-output-files.xcfilelist",
				],
				script:
					'"${PODS_ROOT}/Target Support Files/Pods-KotekanApp/Pods-KotekanApp-resources.sh"\n',
			},
		],
		settings: {
			groups: ["base"],
		},
		scheme: {
			testTargets: testTargetName,
		},
	};

	const spec = {
		settingGroups,
		name: targetName,
		targets: {
			[targetName]: target,
			[testTargetName]: {
				...commonTargetOptions,
				type: "bundle.unit-test",
				sources: testTargetName,
				prebuildScripts: [
					{
						name: "[CP] Check Pods Manifest.lock",
						inputFiles: [
							"${PODS_PODFILE_DIR_PATH}/Podfile.lock",
							"${PODS_ROOT}/Manifest.lock",
						],
						outputFiles: [
							"$(DERIVED_FILE_DIR)/Pods-KotekanApp-KotekanAppTests-checkManifestLockResult.txt",
						],
						script:
							'diff "${PODS_PODFILE_DIR_PATH}/Podfile.lock" "${PODS_ROOT}/Manifest.lock" > /dev/null\nif [ $? != 0 ] ; then\n    # print error to STDERR\n    echo "error: The sandbox is not in sync with the Podfile.lock. Run \'pod install\' or update your CocoaPods installation." >&2\n    exit 1\nfi\n# This output is used by Xcode \'outputs\' to avoid re-running this script phase.\necho "SUCCESS" > "${SCRIPT_OUTPUT_FILE_0}"\n',
					},
				],
				postBuildScripts: [
					{
						name: "[CP] Embed Pods Frameworks",
						script:
							'"${PODS_ROOT}/Target Support Files/Pods-KotekanApp-KotekanAppTests/Pods-KotekanApp-KotekanAppTests-frameworks.sh"\n',
						inputFileLists: [
							"${PODS_ROOT}/Target Support Files/Pods-KotekanApp-KotekanAppTests/Pods-KotekanApp-KotekanAppTests-frameworks-${CONFIGURATION}-input-files.xcfilelist",
						],
						outputFileLists: [
							"${PODS_ROOT}/Target Support Files/Pods-KotekanApp-KotekanAppTests/Pods-KotekanApp-KotekanAppTests-frameworks-${CONFIGURATION}-output-files.xcfilelist",
						],
					},
					{
						name: "[CP] Copy Pods Resources",
						inputFileLists: [
							"${PODS_ROOT}/Target Support Files/Pods-KotekanApp-KotekanAppTests/Pods-KotekanApp-KotekanAppTests-resources-${CONFIGURATION}-input-files.xcfilelist",
						],
						outputFileLists: [
							"${PODS_ROOT}/Target Support Files/Pods-KotekanApp-KotekanAppTests/Pods-KotekanApp-KotekanAppTests-resources-${CONFIGURATION}-output-files.xcfilelist",
						],
						script:
							'"${PODS_ROOT}/Target Support Files/Pods-KotekanApp-KotekanAppTests/Pods-KotekanApp-KotekanAppTests-resources.sh"\n',
					},
				],
			},
		},
		options: {
			defaultConfig: "Release",
		},
	};

	return spec;
};
