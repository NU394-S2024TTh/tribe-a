/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  printWidth: 90,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  quoteProps: 'consistent',
  endOfLine: 'auto',
  bracketSpacing: true,
  arrowParens: 'always',
};

// {
//   "arrowParens": "always",
//   "bracketSpacing": true,
//   "embeddedLanguageFormatting": "auto",
//   "htmlWhitespaceSensitivity": "css",
//   "insertPragma": false,
//   "jsxBracketSameLine": false,
//   "jsxSingleQuote": false,
//   "proseWrap": "preserve",
//   "quoteProps": "as-needed",
//   "requirePragma": false,
//   "semi": true,
//   "singleQuote": false,
//   "tabWidth": 2,
//   "trailingComma": "es5",
//   "useTabs": false,
//   "vueIndentScriptAndStyle": false,
//   "printWidth": 100
// }
