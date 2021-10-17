/**
 * @fileoverview prevent default import outside index
 * @author Pierre Glandon
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-import-default"),
    RuleTester = require("eslint").RuleTester;
const config = {
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
ruleTester.run("no-import-default", rule, {
    valid: [
        {
            code: "import { foo } from './bar'"
        },
        {
            code: "import * as foobar from './bar'",
        },
        ...['ts', 'tsx', 'js', 'jsx'].map(extension => {
            return {
                code: "import foo from './bar'",
                filename: `index.${extension}`
            }
        })
    ],

    invalid: [
        {
            code: "import foo from './bar'",
            errors: [{message: "Unauthorized default import.", type: "ImportDefaultSpecifier"}],
            output: null
        },
        {
            code: "import foo, { foobar } from './bar'",
            errors: [{message: "Unauthorized default import.", type: "ImportDefaultSpecifier"}],
            output: null
        },
    ],
});
