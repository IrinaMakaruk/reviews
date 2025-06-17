module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['react', 'jsx-a11y', '@typescript-eslint', 'import'],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'prettier',
	],
	settings: {
		react: {
		version: 'detect',
		},
	},
}
