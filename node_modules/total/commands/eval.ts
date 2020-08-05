import {
	Command,
	CommandArgs,
	CommandConfig,
	hasArgs,
	getArg,
} from 'lib/command';
import { InvalidArguments } from 'lib/error';

const lines = (str: string): string[] => str.split('\n');

export default class Eval implements Command {
	config(): CommandConfig {
		const config: CommandConfig = {
			name: 'eval',
			description: 'Evaluates the stdin in a javascript environment.',
			options: [
				{
					name: 'function',
					flags: '-f, --function [function]',
					description: 'stdin is passed as arg of a function.',
				},
			],
		};

		return config;
	}

	async onRun(stdin: string, args: CommandArgs[]): Promise<string> {
		if (!stdin) return stdin;
		if (!hasArgs('function', args)) throw new InvalidArguments();

		const code: string = getArg('function', args).value;

		const wrappedCode: string = `(${code})("${lines(stdin).join(' \\\n')}")`;

		const result: string = eval(wrappedCode);

		return result;
	}
}
