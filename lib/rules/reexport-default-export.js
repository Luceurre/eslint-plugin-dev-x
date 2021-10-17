/**
 * @fileoverview default export should be reexported in an index
 * @author Pierre Glandon
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const {default: resolve} = require("eslint-module-utils/resolve");
const path = require("path");
const fs = require('fs');
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "default export should be reexported in an index",
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
        const getModuleName = () => {
            return path.parse(context.getFilename()).name;
        }

        const isExportDefaultReexported = (indexPath) => {
            if (!indexPath) return false;
            const file = fs.readFileSync(indexPath);
            const moduleName = getModuleName();

            const reexportRegex = new RegExp(`export\\s*\\{\\s*default\\s+as\\s+\\w+\\s*\\}\\s*from\\s*\'\\.\\/${moduleName}\'`)
            return reexportRegex.test(file.toString());
        }

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            // visitor functions for different types of nodes
            ExportDefaultDeclaration: (node) => {
                const fileDirname = path.dirname(context.getPhysicalFilename());
                const resolvedPath = resolve(fileDirname, context);

                if (!isExportDefaultReexported(resolvedPath)) {
                    context.report({
                        node,
                        message: 'Reexport default export',
                        fix() {
                            if (!resolvedPath) {
                                fs.openSync(path.join(fileDirname, 'index.ts'), 'w');
                                fs.appendFileSync(path.join(fileDirname, 'index.ts'), `export { default as ${getModuleName()} } from './${getModuleName()}';\n`)
                                return;
                            }
                            fs.appendFileSync(resolvedPath, `export { default as ${getModuleName()} } from './${getModuleName()}';\n`)
                        }
                    })
                }

            }
        };
    },
};
