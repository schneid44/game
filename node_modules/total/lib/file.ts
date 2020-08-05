const _glob = require('glob');
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const _normalizePath = (fn: (path: string, ...rest: any[]) => any) => {
	return (filePath: string, ...args: any[]): any => {
		return fn.call(fn, path.join(__dirname, `../${filePath}`), ...args);
	};
};

const _getBodyFileName = (filename: string): string => {
	return filename.match(/^(.*?)\.[A-z]{1,2}$/)[1];
};

const _stats = util.promisify(fs.stat);

const _read = util.promisify(fs.readFile);

const _appendPath = (path: string, fileName: string): string =>
	`${path}/${fileName}`;

const _load = _normalizePath(async (path: string) => {
	const file = await import(path);
	return file.default;
});

const _stat = (path: string): Promise<any> =>
	new Promise((resolve, reject) => {
		fs.stat(path, (error: any, result: any) => {
			if (error) return reject(error);
			resolve(result);
		});
	});

export const glob = (path: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		_glob(path, {}, (err: any, files: string[]) => {
			if (err) reject(err);

			resolve(files);
		});
	});
};

export const dir = _normalizePath(async (path: string, fullPath = false) => {
	const files = fs.readdirSync(path);
	return fullPath ? files.map(_appendPath.bind(undefined, path)) : files;
});

export const load = async (paths: string | string[]): Promise<any[]> => {
	if (Array.isArray(paths))
		return Promise.all(
			paths.map((name: string) => {
				const fileName = _getBodyFileName(name);
				return _load(fileName);
			})
		);

	return _load(paths);
};

export const read = async (paths: string | string[]): Promise<any[]> => {
	if (Array.isArray(paths))
		return Promise.all(paths.map((fileName: string) => _read(fileName)));

	return [_read(paths)];
};

export const stats = async (path: string | string[]): Promise<any[]> => {
	if (Array.isArray(path))
		return Promise.all(path.map((filePath: string) => _stat(filePath)));

	return [_stat(path)];
};
