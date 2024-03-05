#!/usr/bin/env bun
// --conditions react-server
// --hot
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { devCommand } from "./dev";
import { nativeCommand } from "./native";

yargs(hideBin(process.argv))
	.command({
		command: "dev",
		describe: "Run the development script",
		handler: () => {
			devCommand();
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
