export const numberFromEnv = (env: string): number | undefined => {
	const n = Number(Bun.env[env]);

	if (Number.isNaN(n)) {
		return undefined;
	}

	return n;
};
