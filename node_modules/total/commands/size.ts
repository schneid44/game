import { FileNotFound, PathNotFound } from 'lib/error';
import { stats, glob } from 'lib/file';
import {
	Command,
	CommandArgs,
	CommandConfig,
	hasArgs,
	getArg,
} from 'lib/command';

export const enum Unit {
	Byte = 'b',
	Kilobyte = 'kb',
	Megabyte = 'mb',
	Gigabyte = 'gb',
}

const bytes = (bytes: number) => (target: Unit) => {
	switch (target) {
		case Unit.Byte:
			return bytes;
		case Unit.Kilobyte:
			return bytes / 1000;
		case Unit.Megabyte:
			return bytes / 1000 / 1000;
		case Unit.Gigabyte:
			return bytes / 1000 / 1000 / 1000;
		default:
			return bytes;
	}
};

async function getSize(stdin: string): Promise<number> {
	let stat: string[];

	try {
		stat = await stats(stdin.split('\n').filter((path: string) => path));
	} catch (error) {
		throw new FileNotFound(stdin.replace('\n', ' '));
	}

	const totalSize: number = stat.reduce(
		(prev: number, next: any) => next.size + prev,
		0
	);

	return totalSize;
}

export default class Size implements Command {
	config(): CommandConfig {
		const config: CommandConfig = {
			name: 'size',
			description:
				'File size. From a list of file paths (separated by a line break), get' +
				'the total size (defaults to bytes)',
			options: [
				{
					name: 'path',
					flags: '-p, --path [path]',
					description: 'directory/file path.',
				},
				{ name: 'unit', flags: '-u, --unit [unit]', description: 'Unit size.' },
			],
		};

		return config;
	}

	async onRun(stdin: string, args: CommandArgs[]): Promise<string> {
		let totalSize = await getSize(stdin);

		if (hasArgs('path', args)) {
			const path: CommandArgs = getArg('path', args);

			const files = await glob(path.value);

			const allFiles = await Promise.all(files.map(getSize));

			const dirSize = allFiles.reduce(
				(prev: number, next: number) => prev + next,
				0
			);

			totalSize = totalSize + dirSize;
		}

		const unit: CommandArgs = getArg('unit', args);

		totalSize = unit ? bytes(totalSize)(unit.value) : totalSize;

		return String(totalSize);
	}
}
