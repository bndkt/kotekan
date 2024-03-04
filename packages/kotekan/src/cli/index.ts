#!/usr/bin/env bun
// --conditions react-server
// --hot
// import path from "node:path";

// const cwd = process.cwd();
// const serverPath = path.join(import.meta.dir, "server.ts");
// const preloadPath = path.join(import.meta.dir, "preload.ts");
// console.log(cwd);
// console.log(import.meta.dir);
// // console.log(serverPath);

// import { $ } from "bun";
// // await $`bun build ${serverPath} --compile --minify --sourcemap --outfile app`;
// await $`bun build ${serverPath} --outdir ./dist --target bun`;

// import "./native";
import "./dev";
