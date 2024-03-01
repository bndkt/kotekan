/// <reference lib="dom" />
import { createRoot } from "react-dom/client";

import { Router } from "./Router";

console.log("RENDER");

createRoot(document.body).render(<Router />);
