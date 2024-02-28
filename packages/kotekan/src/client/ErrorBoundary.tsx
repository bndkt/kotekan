import type { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

export const ErrorBoundary = ({ children }: { children: ReactNode }) => {
	return (
		<ReactErrorBoundary
			FallbackComponent={({ error }) => (
				<div>
					<h1>Error</h1>
					<pre style={{ whiteSpace: "pre-wrap" }}>{error.stack}</pre>
				</div>
			)}
		>
			{children}
		</ReactErrorBoundary>
	);
};
