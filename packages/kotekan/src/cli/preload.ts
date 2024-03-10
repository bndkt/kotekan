import { plugin } from "bun";
import { rscPlugin } from "../plugins/rsc";
import { mdxPlugin } from "../plugins/mdx";

console.log("🥁 PRELOAD");

const development = Bun.env.NODE_ENV === "development";

plugin(rscPlugin({ development }));

plugin(mdxPlugin({ development }));
