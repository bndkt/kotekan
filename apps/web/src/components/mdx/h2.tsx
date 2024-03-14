import { Heading } from "../content/Heading";

export const h2 = function H2(
	props: Omit<React.ComponentPropsWithoutRef<typeof Heading>, "level">,
) {
	return <Heading level={2} {...props} />;
};
