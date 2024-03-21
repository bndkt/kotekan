#!/usr/bin/env bun
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as createCommand from "kotekan/create";

yargs(hideBin(process.argv))
	.scriptName("create-kotekan")
	.command("* [name]", "Create a new Kotekan app", createCommand)
	.help()
	.parse();
