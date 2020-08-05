import {
	Command,
	CommandArgs,
	CommandConfig,
	hasArgs,
	getArg,
} from 'lib/command';

export class TextProcessor {
	chars(content: string): number {
		return content.split('').length;
	}

	words(content: string): number {
		return content.match(/\w+/g).length;
	}

	lines(content: string): number {
		return content.split('\n').length;
	}

	longestLine(content: string): number {
		const lines: string[] = content.split('\n');

		const longest: number = lines.reduce(
			(best: number, line: string): number => {
				return line.length > best ? line.length : best;
			},
			0
		);

		return longest;
	}
}

export default class Tp extends TextProcessor implements Command {
	config(): CommandConfig {
		const config: CommandConfig = {
			name: 'tp',
			description:
				'Text Processor. [L] Length of the longest line. [l] Number of Lines. [w] Number of words. [c] Number of characters.',
			options: [
				{
					name: 'count',
					flags: '-c, --count [count]',
					description: 'Count the number of words',
				},
				{
					name: 'lline',
					flags: '-L, --lline [Lline]',
					description: 'returns the longest line.',
				},
				{
					name: 'lines',
					flags: '-l, --lines [lines]',
					description: 'returns the number of lines',
				},
				{
					name: 'words',
					flags: '-w, --words [words]',
					description: 'returns the number of words',
				},
				{
					name: 'chars',
					flags: '-c, --chars [chars]',
					description: 'returns the number of characters',
				},
			],
		};

		return config;
	}

	async onRun(stdin: string, args: CommandArgs[]): Promise<string> {
		if (hasArgs('chars', args)) {
			return String(this.chars(stdin));
		}

		if (hasArgs('words', args)) {
			return String(this.words(stdin));
		}

		if (hasArgs('lines', args)) {
			return String(this.lines(stdin));
		}

		if (hasArgs('lline', args)) {
			return String(this.longestLine(stdin));
		}
		return String(this.chars(stdin));
	}
}
