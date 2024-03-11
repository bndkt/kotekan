import { PageNavigation } from "./PageNavigation";
import { SmallPrint } from "./SmallPrint";

export const Footer = () => {
	return (
		<footer className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
			<PageNavigation />
			<SmallPrint />
		</footer>
	);
};
