import { Router } from "./Router";

const location = process.env.LOCATION as string;

export function App() {
	return <Router location={location} />;
}
