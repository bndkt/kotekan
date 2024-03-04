import React from "react";
import { SafeAreaView, Text, View } from "react-native";

function App(): React.JSX.Element {
	return (
		<SafeAreaView>
			<View>
				<Text style={{ textAlign: "center", marginTop: 200, fontSize: 48 }}>
					🥁
				</Text>
				<Text style={{ textAlign: "center", marginTop: 20 }}>
					Hello, Kotekan!
				</Text>
			</View>
		</SafeAreaView>
	);
}

export default App;
