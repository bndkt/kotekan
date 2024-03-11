import { navigation } from "../nav/Navigation";
import { PageLink } from "./PageLink";

export const PageNavigation = () => {
	const pathname = ""; // usePathname(); @todo
	const allPages = navigation.flatMap((group) => group.links);
	const currentPageIndex = allPages.findIndex((page) => page.href === pathname);

	if (currentPageIndex === -1) {
		return null;
	}

	const previousPage = allPages[currentPageIndex - 1];
	const nextPage = allPages[currentPageIndex + 1];

	if (!previousPage && !nextPage) {
		return null;
	}

	return (
		<div className="flex">
			{previousPage && (
				<div className="flex flex-col items-start gap-3">
					<PageLink label="Previous" page={previousPage} previous />
				</div>
			)}
			{nextPage && (
				<div className="ml-auto flex flex-col items-end gap-3">
					<PageLink label="Next" page={nextPage} />
				</div>
			)}
		</div>
	);
};
