// Adapted from https://github.com/facebook/react/blob/main/fixtures/flight/src/ErrorBoundary.js
// Yes, this is a class component, because https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
"use client";
import { Component } from "react";

interface State {
	error: { message: string } | null;
}

interface Props {
	children: React.ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { error: null };

	static getDerivedStateFromError(error: State["error"]) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return <div>Error: {this.state.error.message}</div>;
		}

		return this.props.children;
	}
}
