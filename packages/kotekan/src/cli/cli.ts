#!/usr/bin/env bun
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { createCommand } from "./create";
import { startCommand } from "./commands/start";
import { nativeCommand } from "./commands/native";
import { jsxCommand } from "./commands/jsx";
import { ssrCommand } from "./commands/ssr";

yargs(hideBin(process.argv))
	.scriptName("kotekan")
	.command({
		command: "create [name]",
		describe: "Create a new Kotekan app",
		handler: (args) => {
			createCommand(args.name);
		},
	})
	// .command({
	// 	command: "dev",
	// 	describe: "Run the development server",
	// 	handler: () => {
	// 		startCommand(true);
	// 	},
	// })
	.command({
		command: "start",
		describe: "Run the production server",
		handler: () => {
			startCommand();
		},
	})
	.command({
		command: "jsx",
		describe: "Run the jsx server",
		handler: () => {
			jsxCommand();
		},
	})
	.command({
		command: "ssr",
		describe: "Run the ssr server",
		handler: () => {
			ssrCommand();
		},
	})
	.command({
		command: "native",
		describe: "Run the React Native development script",
		handler: () => {
			nativeCommand();
		},
	})
	.demandCommand(1, "You need at least one command before moving on")
	.help()
	.parse();
