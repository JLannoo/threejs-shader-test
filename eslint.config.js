import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
	{files: ["**/*.{js,mjs,cjs,ts}"]},
	{languageOptions: { globals: globals.browser }},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			// Always semis
			"semi": ["error", "always"],
			// Always double quotes
			"quotes": ["error", "double"],
			// Tab indentation
			"indent": ["error", "tab"],
		}
	}
];