import { AppRegistry } from "react-native";

import { name as appKey } from "./src/app.json";
import App from "./src/App";

console.log("This is the app! It's named", appKey);

AppRegistry.registerComponent(appKey, () => App);
