#!/usr/bin/env bun
import { server } from "../server/server";

const s = await server({ development: Bun.env.NODE_ENV === "development" });

console.log(`Listening on ${s.url}`);
