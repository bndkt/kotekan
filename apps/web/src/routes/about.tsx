import { Wrapper } from "@/components/content/Wrapper";
import { LikeButton } from "../components/demo/LikeButton";

export default function About() {
	return (
		<Wrapper>
			<title>About - Kotekan</title>
			<h1>About Kotekan</h1>
			<p className="text-red-500">This should be red if Tailwind works 234.</p>
			<LikeButton />
		</Wrapper>
	);
}
