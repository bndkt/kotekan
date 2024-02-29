/// <reference lib="dom" />
import { createRoot } from "react-dom/client";

import { Router } from "./Router";

const container = document.createElement("div");
container.id = "root";
document.body.appendChild(container);

const root = createRoot(container);
root.render(<Router />);
