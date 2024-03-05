import type { ReactNode } from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function App({ children }: { children?: ReactNode }) {
	return (
		<SafeAreaView>
			<View>
				<Text style={{ textAlign: "center", marginTop: 200, fontSize: 48 }}>
					🥁
				</Text>
				<Text style={{ textAlign: "center", marginTop: 20 }}>
					Hello, Kotekan!
				</Text>
				{children}
			</View>
		</SafeAreaView>
	);
}
