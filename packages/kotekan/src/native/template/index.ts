import { AppRegistry } from "react-native";

// @ts-expect-error File does not exist
import App from "../../src/app";

AppRegistry.registerComponent("HelloWorld", () => App);
