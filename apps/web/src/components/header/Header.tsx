import { Nav } from "../nav/Nav";

export const Header = () => {
	return (
		<header>
			<div>
				<h1>
					<a href="/">Kotekan</a>
				</h1>
				<Nav />
			</div>
		</header>
	);
};
