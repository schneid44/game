import * as Commander from 'commander';
import { CommandArgs } from './args';
import { CommandConfig } from './config';

export interface Command {
	config: () => CommandConfig;
	onRun: (stdin: string, args: CommandArgs[]) => Promise<string>;
}
