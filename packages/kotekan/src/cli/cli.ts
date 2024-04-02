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
	.command([createCommand])
	.command([devCommand])
	.command([startCommand])
	.command([jsxCommand])
	.command([ssrCommand])
	.command([nativeCommand])
	.demandCommand(1, "You need at least one command before moving on")
	.help()
	.parse();
