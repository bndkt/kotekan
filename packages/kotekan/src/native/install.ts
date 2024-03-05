import path from "node:path";
import { $ } from "bun";

interface InstallProps {
	buildPath: string;
}

export const install = async ({ buildPath }: InstallProps) => {
	console.log("Install");

	const iosPath = path.join(buildPath, "ios");
	const podfileLockPath = path.join(iosPath, "Podfile.lock");
	const podfile = Bun.file(podfileLockPath);

	if (!(await podfile.exists())) {
		// await $`pod install`.cwd(iosPath);
		// $.env({ RCT_NEW_ARCH_ENABLED: "1" });
		const result = await $`export RCT_NEW_ARCH_ENABLED=1 && pod install`.cwd(
			iosPath,
		);
		// .env({ RCT_NEW_ARCH_ENABLED: "0", LANG: "en_US.UTF-8" });

		// console.log(result.text(), result.exitCode);
	}
};
