import { plugin } from "bun";

import { kotekanPlugin } from "../plugins/kotekan";
import { mdxPlugin } from "../plugins/mdx";

console.log("🥁 PRELOAD");

const development = Bun.env.NODE_ENV === "development";

plugin(kotekanPlugin({ development }));
plugin(mdxPlugin({ development }));
