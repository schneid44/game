import { CommandArgs } from './args';

export interface CommandConfig {
	name: string;
	description: string;
	options: CommandArgs[];
}
