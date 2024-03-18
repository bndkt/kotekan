export const boolFromEnv = (env: string): boolean | undefined => {
	const b = Bun.env[env]?.toLowerCase();

	return b === "true" ? true : b === "false" ? false : undefined;
};
