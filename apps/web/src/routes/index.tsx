import { Wrapper } from "@/components/content/Wrapper";
import { Button } from "@/components/Button";
import { Resources } from "@/components/content/Resources";
import { Guides } from "@/components/content/Guides";

export default function Index() {
	return (
		<Wrapper>
			<title>Kotekan</title>
			<h1>Kotekan</h1>
			<p>
				Use the Protocol API to access contacts, conversations, group messages,
				and more and seamlessly integrate your product into the workflows of
				dozens of devoted Protocol users.
			</p>
			<div className="not-prose mb-16 mt-6 flex gap-3">
				<Button href="/quickstart" arrow="right">
					Quickstart
				</Button>
				<Button href="/sdks" variant="outline">
					Explore SDKs
				</Button>
			</div>
			<h2>Getting started</h2>
			<p className="lead">
				To get started, create a new application in your [developer
				settings](#), then read about how to make requests for the resources you
				need to access using our HTTP APIs or dedicated client SDKs. When your
				integration is ready to go live, publish it to our [integrations
				directory](#) to reach the Protocol community.{" "}
			</p>
			<div className="not-prose">
				<Button href="/sdks" variant="text" arrow="right">
					Get your API key
				</Button>
			</div>

			<Guides />

			<Resources />
		</Wrapper>
	);
}
