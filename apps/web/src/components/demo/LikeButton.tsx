"use client";
import { useState } from "react";

export const LikeButton = () => {
	const [likes, setLikes] = useState(0);

	return (
		<button type="button" onClick={() => setLikes(likes + 1)}>
			Like ({likes} ❤️)
		</button>
	);
};
