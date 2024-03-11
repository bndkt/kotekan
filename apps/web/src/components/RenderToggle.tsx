"use client";

const notificationMethods = [
	{ id: "email", title: "Server-side Rendering (SSR)" },
	{ id: "sms", title: "Client-side Rendering (CSR)" },
];

export const RenderToggle = () => {
	return (
		<div>
			<label className="text-base font-semibold text-gray-900">
				Notifications
			</label>
			<p className="text-sm text-gray-500">
				How do you prefer to receive notifications?
			</p>
			<fieldset className="mt-4">
				<legend className="sr-only">Notification method</legend>
				<div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
					{notificationMethods.map((notificationMethod) => (
						<div key={notificationMethod.id} className="flex items-center">
							<input
								id={notificationMethod.id}
								name="notification-method"
								type="radio"
								defaultChecked={notificationMethod.id === "email"}
								className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-600"
							/>
							<label
								htmlFor={notificationMethod.id}
								className="ml-3 block text-sm font-medium leading-6 text-gray-900"
							>
								{notificationMethod.title}
							</label>
						</div>
					))}
				</div>
			</fieldset>
		</div>
	);
};
