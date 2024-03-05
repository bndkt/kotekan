"use client";

import { useState } from "react";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

export const LikeButton = () => {
	const [likes, setLikes] = useState(0);
	// const counter = 1;

	return (
		<h.button type="button" onClick={() => setLikes(likes + 1)}>
			Like ({likes} ❤️)
		</h.button>
	);
};
