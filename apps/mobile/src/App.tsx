import type { ReactNode } from "react";
import { css, html as h } from "react-strict-dom";
import { Alert, SafeAreaView } from "react-native";

const styles = css.create({
	icon: {
		textAlign: "center",
		marginTop: 200,
		fontSize: 48,
	},
	title: {
		textAlign: "center",
		marginTop: 20,
	},
	button: {
		marginTop: 20,
		marginLeft: 20,
		marginRight: 20,
		textAlign: "center",
		borderWidth: 0,
		padding: 10,
		backgroundColor: "#007bff",
		color: "white",
	},
});

export default function App({ children }: { children?: ReactNode }) {
	return (
		<SafeAreaView>
			<h.div>
				<h.p style={styles.icon}>🥁</h.p>
				<h.p style={styles.title}>Hello, Kotekan!</h.p>
				{/* <h.button style={styles.button} onClick={() => Alert.alert("Test")}>
					Alert
				</h.button> */}
				{children}
			</h.div>
		</SafeAreaView>
	);
}
