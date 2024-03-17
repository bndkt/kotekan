export const usePathname = () => {
	if (typeof window !== "undefined") {
		const url = new URL(window.location.href);
		return url.pathname;
	}

	return false;
};
