import arg from 'arg';
import inquirer from 'inquirer';
import rc from 'rc';

import { createProject } from './main';

const conf = rc('tap');

function parseArgumentsIntoOptions(rawArgs) {
	const args = arg(
		{
			'--class': Boolean,
			'--default-export': Boolean,
			'--type': String,
			'-c': '--class',
			'-d': '--default-export',
			'-t': '--type',
		},
		{
			argv: rawArgs.slice(2),
		}
	);

	const splittedPath = [...args._[0].split('/')];
	const file = splittedPath.pop();
	const extension = args._[0].split('.').slice(-1);
	const path = splittedPath.join('/');

	return {
		file,
		path,
		extension,
		isClass: args['--class'] || false,
		isDefaultExport: args['--default-export'] || false,
		conf,
	};
}

async function promptForMissingOptions(options) {
	const questions = [];
	if (!options.path) {
		questions.push({
			type: 'list',
			name: 'path',
			message: 'Please specify path that needs to be create',
		});
	}

	const answers = await inquirer.prompt(questions);
	return {
		...options,
		path: options.path || answers.path,
	};
}

export async function cli(args) {
	let options = parseArgumentsIntoOptions(args);
	options = await promptForMissingOptions(options);

	createProject(options);
}
