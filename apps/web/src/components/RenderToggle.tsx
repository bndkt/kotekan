"use client";
import { useState } from "react";
import { RadioGroup, Radio, Label } from "react-aria-components";

export const RenderToggle = () => {
	const [renderMode, setRenderMode] = useState<"ssr" | "csr">("ssr");

	console.log({ renderMode });

	return (
		<div>
			Toggle
			<RadioGroup>
				<Label>Favorite pet</Label>
				<Radio value="dogs">Dog</Radio>
				<Radio value="cats">Cat</Radio>
				<Radio value="dragon">Dragon</Radio>
			</RadioGroup>
		</div>
	);
};
