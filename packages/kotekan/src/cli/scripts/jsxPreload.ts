import { plugin } from "bun";

import { kotekanPlugin } from "../../plugins/kotekan";
import { mdxPlugin } from "../../plugins/mdx";

const development = process.env.NODE_ENV === "development";

plugin(kotekanPlugin({ development, server: true }));
plugin(mdxPlugin({ development }));
