import fs from 'node:fs';

const ENV_FILE_PATH = '.env';
const ENV_TYPES_PATH = 'types/env.d.ts';

// Function to parse the env file
function parsefile(path: string): string[] {
	const buffer = fs.readFileSync(path);
	const content = buffer.toString('utf8');
	const env = [];
	for (const line of content
		.split(/\r?\n/g)
		.map((l) => l.replace('\r', ''))
		.filter((v) => v !== '')) {
		const match = line.match(/^(?<key>\w*)(?:\s*=\s*)(?<value>.[^\s]+)$/);
		if (!match || !match.groups) return env;
		const { key } = match.groups;
		env.push(key);
	}

	return env;
}

function transpileFile(keys: string[]) {
	if (keys.length === 0) {
		return `// @generated code with custom CLI, do not modify it directly.

namespace NodeJS {
	interface ProcessEnv {}
}
`;
	}

	const types = `${keys.map((v) => `\t\t${v}: string;`).join('\n')}`;
	const content = `// @generated code with custom CLI, do not modify it directly.

namespace NodeJS {
	interface ProcessEnv {
${types}
	}
}
`;

	return content;
}

console.log(`[!] Parsing ${ENV_FILE_PATH}`);

const keys = parsefile(ENV_FILE_PATH);

if (keys.length === 0) {
	console.log('[!] Not keys founded, writing empty file');
} else {
	console.log('[+] Founded keys!');
}

const content = transpileFile(keys);

fs.writeFileSync(ENV_TYPES_PATH, content);

console.log(`[+] Generated file in ${ENV_TYPES_PATH}!`);
