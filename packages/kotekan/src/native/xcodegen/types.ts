export interface XcodeGenSpec {
	name: string;
	targets?: Record<
		string,
		{
			platform: string[];
		}
	>;
}
