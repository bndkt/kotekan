import Root from "../../../../apps/web/src/root";
import { Router } from "./Router";

const HYDRATE = process.env.HYDRATE as string;

export const Document = ({ stylesheet }: { stylesheet: string }) => {
	return (
		<>
			{/* @ts-expect-error Unknown attribute: precedence */}
			<link rel="stylesheet" href={stylesheet} precedence="default" />
			<Root>{HYDRATE && <Router />}</Root>
		</>
	);
};
