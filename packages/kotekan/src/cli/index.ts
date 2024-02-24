#!/usr/bin/env bun --hot
import { server } from "../server/server";

const s = server({ development: true });

console.log(`Listening on ${s.url}`);
