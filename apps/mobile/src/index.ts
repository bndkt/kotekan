import { AppRegistry } from "react-native";

import { name as appKey } from "./app.json";
import App from "./App";

console.log("This is the app! It's named", appKey);

AppRegistry.registerComponent(appKey, () => App);
