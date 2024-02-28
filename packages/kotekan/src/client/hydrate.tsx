/// <reference lib="dom" />
import { hydrateRoot } from "react-dom/client";

import { App } from "./App";

console.log("HYDRATE");

hydrateRoot(document, <App />);
