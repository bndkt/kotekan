import Root from "../../../../apps/web/src/root"; // @todo
import { Router } from "./Router";

const HYDRATE = process.env.HYDRATE as string;

export const Document = ({ stylesheet }: { stylesheet: string }) => {
	return (
		<>
			{stylesheet && (
				<link rel="stylesheet" href={stylesheet} precedence="default" />
			)}
			<Root>{HYDRATE && <Router />}</Root>
		</>
	);
};
