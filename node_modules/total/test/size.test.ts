import {} from 'jest';
import { exec } from 'child_process';
const between = require('in-between');

test('-u kb', () => {
	return new Promise((resolve: any, reject: any) => {
		exec(
			'find test/data | node ./dist/cli.js size -u kb',
			(err: any, stdout: any, stderr: any) => {
				if (err) return reject(err);
				if (stderr) return reject(stderr);

				expect(between(64.0, 65.81)(Number(stdout))).toBe(true);
				resolve();
			}
		);
	});
});

test('size --unit b', () => {
	return new Promise((resolve: any, reject: any) => {
		exec(
			'find test/data | node ./dist/cli.js size -u b',
			(err: any, stdout: any, stderr: any) => {
				if (err) return reject(err);
				if (stderr) return reject(stderr);

				expect(between(64000, 65010)(Number(stdout))).toBe(true);
				resolve();
			}
		);
	});
});

test('size --path ', () => {
	return new Promise((resolve: any, reject: any) => {
		exec(
			'find test/data | node ./dist/cli.js size -p "./test/data/**.txt"',
			(err: any, stdout: any, stderr: any) => {
				if (err) return reject(err);
				if (stderr) return reject(stderr);

				expect(between(63700 * 2, 66010 * 2)(Number(stdout))).toBe(true);
				resolve();
			}
		);
	});
});
