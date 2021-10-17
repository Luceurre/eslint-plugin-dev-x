/**
 * @fileoverview should import from parent if reexported
 * @author Pierre Glandon
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const {default: resolve} = require("eslint-module-utils/resolve");
const fs = require("fs");
const path = require('path');
module.exports = {
    meta: {
        type: 'suggestion', // `problem`, `suggestion`, or `layout`
        docs: {
            description: "should import from parent if reexported",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: 'code', // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create(context) {
        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            // visitor functions for different types of nodes
            ImportDeclaration: (node) => {
                if (path.parse(path.dirname(context.getPhysicalFilename())).name === 'src') return;
                if (node.source.value[0] === '.' && node.source.value[1] === '.') return;
                if (/node_modules/.test(resolve(node.source.value, context))) return;

                const parentIndex = resolve(path.join(node.source.value, '..', 'index'), context);
                if (parentIndex === undefined) return;
                const file = fs.readFileSync(parentIndex);
                const specifier = node.specifiers[0];
                const regExp = new RegExp(`${specifier.local.name}\\s+`)
                if (regExp.test(file.toString())) {
                    context.report({
                        node,
                        message: 'Should import from parent index.',
                        fix(fixer) {
                            if (node.specifiers.length !== 1) return;

                            const splitImport = node.source.value.split('/');
                            splitImport.pop();
                            const truncatedImport = splitImport.join('/');
                            return fixer.replaceText(node.source, `'${truncatedImport}'`);
                        }
                    })
                }
            }
        }
    },
};
