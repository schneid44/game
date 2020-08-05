export const hasArgs = (name: string, args: CommandArgs[]): boolean =>
	args.some(args => args.name === name);

export const getArg = (name: string, args: CommandArgs[]): CommandArgs =>
	args.reduce((prev: any, next) => (prev.name === name ? prev : next), {});

export interface CommandArgs {
	name: string;
	description: string;
	flags: string;
	value?: any;
}
