import { server } from "kotekan";

const s = await server();

console.log(`Listening on ${s.url}`);
