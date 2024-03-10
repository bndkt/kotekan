import { plugin } from "bun";

import { rscPlugin } from "../plugins/rsc";
import { mdxPlugin } from "../plugins/mdx";
import { tailwindPlugin } from "../plugins/tailwind";

console.log("🥁 PRELOAD");

const development = Bun.env.NODE_ENV === "development";

plugin(rscPlugin({ development }));

plugin(mdxPlugin({ development }));

// plugin(tailwindPlugin({ development }));
