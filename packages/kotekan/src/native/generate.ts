import path from "node:path";
import fs from "node:fs"; // @todo
import { resolveSync } from "bun";

interface GenerateProps {
	buildPath: string;
	targetName: string;
	displayName: string;
}

export const generate = async ({
	buildPath,
	targetName,
	displayName,
}: GenerateProps) => {
	const templateTargetName = "HelloWorld";

	type TemplateFiles = {
		path: string;
		fileName?: string;
		replacements?: {
			searchValue: string | RegExp;
			replaceValue: string;
		}[];
		reactNativeTemplate?: boolean;
	}[];

	const templateFiles: TemplateFiles = [
		// {
		// 	path: "Gemfile",
		// 	reactNativeTemplate: true,
		// },
		{
			path: "ios/Podfile",
			replacements: [
				{
					searchValue: `"#{Pod::Config.instance.installation_root}/.."`,
					replaceValue: `"#{Pod::Config.instance.installation_root}/../../.."`,
				},
			],
			reactNativeTemplate: true,
		},
		{
			path: "ios/_xcode.env",
			fileName: ".xcode.env",
			reactNativeTemplate: true,
		},
		{
			path: "ios/HelloWorld.xcodeproj/project.pbxproj",
			reactNativeTemplate: true,
		},
		{
			path: "ios/HelloWorld.xcodeproj/xcshareddata/xcschemes/HelloWorld.xcscheme",
			reactNativeTemplate: true,
		},
		{ path: "ios/HelloWorld/AppDelegate.h", reactNativeTemplate: true },
		{
			path: "ios/HelloWorld/AppDelegate.mm",
			reactNativeTemplate: true,
		},
		{
			path: "ios/HelloWorld/Info.plist",
			replacements: [
				{ searchValue: "Hello App Display Name", replaceValue: displayName },
			],
			reactNativeTemplate: true,
		},
		{
			path: "ios/HelloWorld/LaunchScreen.storyboard",
			reactNativeTemplate: true,
		},
		{ path: "ios/HelloWorld/main.m", reactNativeTemplate: true },
		{
			path: "ios/HelloWorld/Images.xcassets/Contents.json",
			reactNativeTemplate: true,
		},
		{
			path: "ios/HelloWorld/Images.xcassets/AppIcon.appiconset/Contents.json",
			reactNativeTemplate: true,
		},
		{
			path: "index.ts",
			replacements: [
				{ searchValue: "HelloWorld", replaceValue: targetName },
				{
					searchValue: /\/\/ @ts-expect-error File does not exist\r?\n/g,
					replaceValue: "",
				},
			],
		},
		{
			path: "metro.config.cjs",
		},
	];

	const reactNativePath = resolveSync("react-native", ".");
	const rnTemplatePath = path.join(path.dirname(reactNativePath), "template");

	// Remove ios folder
	if (fs.existsSync(buildPath)) {
		// await $`rm -rf ios`.cwd(buildPath);
	}

	// Write template files
	const templatePath = path.join(import.meta.dir, "template");
	for (const templateFile of templateFiles) {
		const templateFilePath = templateFile.reactNativeTemplate
			? path.join(rnTemplatePath, templateFile.path)
			: path.join(templatePath, templateFile.path);
		let templateFileContent = await Bun.file(templateFilePath).text();

		const templateFileFolder = path.dirname(templateFile.path);
		const targetFileFolder = templateFileFolder.replaceAll(
			templateTargetName,
			targetName,
		);

		const templateFileName = path.basename(templateFile.path);
		const targetFileName =
			templateFile.fileName ??
			templateFileName.replaceAll(templateTargetName, targetName);

		const targetPath = path.join(buildPath, targetFileFolder, targetFileName);

		for (const replacement of templateFile.replacements ?? []) {
			templateFileContent = templateFileContent.replaceAll(
				replacement.searchValue,
				replacement.replaceValue,
			);
		}

		templateFileContent = templateFileContent.replaceAll(
			templateTargetName,
			targetName,
		);

		await Bun.write(targetPath, templateFileContent);
	}
};
