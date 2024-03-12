import { Feedback } from "./Feedback";
import { Prose } from "./Prose";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<article className="flex h-full flex-col pb-10 pt-16">
			<Prose className="flex-auto">{children}</Prose>
			<footer className="mx-auto mt-16 w-full max-w-2xl lg:max-w-5xl">
				<Feedback />
			</footer>
		</article>
	);
};
