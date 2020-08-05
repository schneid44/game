import {} from 'jest';
import { exec } from 'child_process';

describe('tp', () => {
	test('tp. Character count.', () => {
		return new Promise((resolve: any, reject: any) => {
			exec(
				'echo "hello\nworld" | node ./dist/cli.js tp -c',
				(err: any, stdout: string, stderr: any) => {
					if (err) return reject(err);
					if (stderr) return reject(stderr);

					expect(parseInt(stdout)).toBe(12);
					resolve();
				}
			);
		});
	});

	test('tp -L. Longest line.', () => {
		return new Promise((resolve: any, reject: any) => {
			exec(
				'echo "hello\nworld" | node ./dist/cli.js tp -L',
				(err: any, stdout: string, stderr: any) => {
					if (err) return reject(err);
					if (stderr) return reject(stderr);

					expect(parseInt(stdout)).toBe(5);
					resolve();
				}
			);
		});
	});

	test('tp -l. Returns the number of lines.', () => {
		return new Promise((resolve: any, reject: any) => {
			exec(
				'echo "hello\nworld" | node ./dist/cli.js tp -l',
				(err: any, stdout: string, stderr: any) => {
					if (err) return reject(err);
					if (stderr) return reject(stderr);

					expect(parseInt(stdout)).toBe(3);
					resolve();
				}
			);
		});
	});

	test('tp  -w. Word count.', () => {
		return new Promise((resolve: any, reject: any) => {
			exec(
				'echo "hello\nworld th3d" | node ./dist/cli.js tp -w',
				(err: any, stdout: string, stderr: any) => {
					if (err) return reject(err);
					if (stderr) return reject(stderr);

					expect(parseInt(stdout)).toBe(3);
					resolve();
				}
			);
		});
	});
});
