import { AppRegistry } from "react-native";

// @ts-expect-error File does not exist
import App from "../../src/App";

AppRegistry.registerComponent("HelloWorld", () => App);
