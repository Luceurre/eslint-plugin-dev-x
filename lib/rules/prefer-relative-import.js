/**
 * @fileoverview highlight when relative import should be used
 * @author Pierre Glandon
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const {default: resolve} = require("eslint-module-utils/resolve");
const path = require("path");

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "highlight when relative import should be used",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    // variables should be defined here
    const EXTERNAL_MODULE_REGEX = /node_modules/

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const isExternalLibraryOrUnresolvedImport = (resolvedPath) => {
        return resolvedPath === undefined || EXTERNAL_MODULE_REGEX.test(resolvedPath)
   }

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // visitor functions for different types of nodes
      ImportDeclaration: (node) => {
        const fileDirname = path.dirname(context.getPhysicalFilename());

        // Avoid root modification
        if (path.parse(fileDirname).name === 'src') return;

        const resolvedPath = resolve(node.source.value, context);
        if (isExternalLibraryOrUnresolvedImport(resolvedPath)) return;
        const resolvedPathDirname = path.dirname(resolvedPath);

        const relative = path.relative(fileDirname, resolvedPathDirname);

        if (relative !== undefined && !relative.startsWith('..') && !path.isAbsolute(relative) && node.source.value[0] !== '.') {
          context.report({
            node: node,
            message:
                "Prefer relative import.",
            fix: (fixer) => {
              const moduleName = path.parse(resolvedPath).name;
              const moduleImportsName = moduleName === 'index' ? '' : `/${moduleName}`
              if (relative === '') {
                return fixer.replaceTextRange(node.source.range, `'.${moduleImportsName}'`)
              }
              else {
                return fixer.replaceTextRange(node.source.range, `'./${relative}${moduleImportsName}'`)
              }
            }
          });
        }
      }
    };
  },
};
