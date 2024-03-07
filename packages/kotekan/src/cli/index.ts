#!/usr/bin/env bun --hot
// --conditions react-server
// --hot
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { startCommand } from "./start";
import { nativeCommand } from "./native";

yargs(hideBin(process.argv))
	.command({
		command: "dev",
		describe: "Run the development script",
		handler: () => {
			startCommand(true);
		},
	})
	.command({
		command: "start",
		describe: "Run the production script",
		handler: () => {
			startCommand();
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
	.parse();
