#!/usr/bin/env bun
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createCommand } from "kotekan/cli";

yargs(hideBin(process.argv))
	.scriptName("create-kotekan")
	.command(
		"* [name]",
		"Create a new Kotekan app",
		(yargs) => {
			return yargs.positional("name", {
				describe: "The name of the app",
				type: "string",
			});
		},
		(args) => {
			createCommand(args.name);
		},
	)
	.help()
	.parse();
