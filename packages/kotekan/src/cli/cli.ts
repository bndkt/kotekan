#!/usr/bin/env bun
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as createCommand from "./commands/create";
import * as devCommand from "./commands/dev";
import * as startCommand from "./commands/start";
import * as nativeCommand from "./commands/native";
import * as jsxCommand from "./commands/jsx";
import * as ssrCommand from "./commands/ssr";

yargs(hideBin(process.argv))
	.scriptName("kotekan")
	// .commandDir("commands")
	.command([createCommand])
	.command([devCommand])
	.command([startCommand])
	.command([jsxCommand])
	.command([ssrCommand])
	.command([nativeCommand])
	// .command({
	// 	command: "create [name] --minimal",
	// 	describe: "Create a new Kotekan app",
	// 	builder: (yargs) => {
	// 		return yargs.alias("m", "minimal").boolean("minimal");
	// 	},
	// 	handler: (args) => {
	// 		createCommand({ name: args.name, minimal: args.minimal });
	// 	},
	// })
	// // .command({
	// // 	command: "dev",
	// // 	describe: "Run the development server",
	// // 	handler: () => {
	// // 		startCommand(true);
	// // 	},
	// // })
	// .command({
	// 	command: "start",
	// 	describe: "Run the production server",
	// 	handler: () => {
	// 		startCommand();
	// 	},
	// })
	// .command({
	// 	command: "jsx",
	// 	describe: "Run the jsx server",
	// 	handler: () => {
	// 		jsxCommand();
	// 	},
	// })
	// .command({
	// 	command: "ssr",
	// 	describe: "Run the ssr server",
	// 	handler: () => {
	// 		ssrCommand();
	// 	},
	// })
	// .command({
	// 	command: "native",
	// 	describe: "Run the React Native development script",
	// 	handler: () => {
	// 		nativeCommand();
	// 	},
	// })
	.demandCommand(1, "You need at least one command before moving on")
	.help()
	.parse();
