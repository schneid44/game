import {} from 'jest';
import { exec } from 'child_process';

describe('eval', () => {
	test('eval -f. Evaluates stdin in a function.', () => {
		return new Promise((resolve: any, reject: any) => {
			exec(
				'echo "hello" | node ./dist/cli.js eval -f "std => stdin + \' world\'"',
				(err: any, stdout: string, stderr: any) => {
					if (err) return reject(err);
					if (stderr) return reject(stderr);
					expect(stdout.replace(/\r?\n|\r/g, '')).toEqual('hello world');
					resolve();
				}
			);
		});
	});
});
