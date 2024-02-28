/// <reference lib="dom" />
import { createRoot } from "react-dom/client";

import { Router } from "./Router";

console.log("RENDER");

const container = document.createElement("div");
container.id = "root";
document.body.appendChild(container);

// const container = document.getElementById("root");

const root = createRoot(container);
root.render(<Router />);
