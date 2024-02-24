import { router } from "./router";

const r = router();

export const fetch = async (request: Request): Promise<Response> => {
	const match = r.match(request.url);
	console.log(match?.filePath);

	const content = match?.filePath
		? Bun.file(match.filePath).text()
		: "Not found";

	return new Response("Hello");
};
