export class SubcommandNotFound extends Error {
	constructor(public attempt: any, ...args: any[]) {
		super(`error: unknown subcommand \`${attempt}\``);
		this.name = 'SubcommandNotFound';
	}
}

export class FileNotFound extends Error {
	constructor(public attempt: string, ...args: any[]) {
		super(`error: file \`${attempt}\` not found`);
		this.name = 'FileNotFound';
	}
}

export class PathNotFound extends Error {
	constructor(public attempt: string, ...args: any[]) {
		super(`error: path \`${attempt}\` not found`);
		this.name = 'PathNotFound';
	}
}

export class InvalidArguments extends Error {
	constructor(public attempt = '', ...args: any[]) {
		super(`error: invalid arguments`);
		this.name = 'InvalidArguments';
	}
}
