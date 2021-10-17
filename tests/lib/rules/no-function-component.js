/**
 * @fileoverview disable the use of non-arrow function as react component
 * @author Pierre Glandon
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-function-component"),
  RuleTester = require("eslint").RuleTester;
const config = {
  // eslint-disable-next-line node/no-unpublished-require
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
}
RuleTester.setDefaultConfig(config);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-function-component", rule, {
  valid: [
    // give me some code that won't trigger a warning
      ...['string', 'void', 'number', 'any', 'unknown'].map((returnType) => {
        return {
          code: `function Component(): ${returnType} {}`
        }
      }),
    {
      code: 'const Component = (): JSX.Element => {}'
    }
  ],

  invalid: [
    {
      code: "function Component(): JSX.Element {}",
      errors: [{ message: "Unauthorized function component." }],
    },
  ],
});
