/**
 * @fileoverview highlight when relative import should be used
 * @author Pierre Glandon
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-relative-import"),
  RuleTester = require("eslint").RuleTester;
const path = require("path");
const config = {
  // eslint-disable-next-line node/no-unpublished-require
  // parser: require.resolve('@typescript-eslint/parser'),
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
ruleTester.run("prefer-relative-import", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "import bar from 'foo/bar'",
      errors: [{message: "Fill me in.", type: "Me too"}],
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: path.join(process.cwd()
                , 'tests', 'lib', 'rules', 'fixtures', 'preferRelativeImportFixtures', 'sourceImport'),
          },
        }
      },
      filename: path.join(process.cwd()
          , 'tests', 'lib', 'rules', 'fixtures', 'preferRelativeImportFixtures', 'sourceImport', 'src', 'foo', 'foo.ts')
    }
  ],
});
