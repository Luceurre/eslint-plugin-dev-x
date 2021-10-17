/**
 * @fileoverview index should be reexported when export name is the same as directory
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
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "index should be reexported when export name is the same as directory",
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
    const isIndex = () => {
      return path.parse(context.getFilename()).name === 'index';
    }

    const getDirname = () => {
      return path.parse(path.parse(context.getFilename()).dir).name;
    }

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // visitor functions for different types of nodes
      ExportNamedDeclaration: (node) => {
        // We don't want to work in root directory for side effect reason
        if (getDirname() === 'src') return;
        if (!isIndex()) return;
        if (node.specifiers.length !== 1) return;

        const specifier = node.specifiers[0];
        if (specifier.exported.name !== getDirname()) return;
        let parentIndex = resolve('../index', context);
        if (parentIndex !== undefined) {
          const file = fs.readFileSync(parentIndex);
          const regExp = new RegExp(`${getDirname()}`)
          if (regExp.test(file.toString())) return;
        }

        context.report({
          node,
          message: "Export should be reexported in parent index.",
          fix() {
            let parentIndex = resolve('../index', context);
            if (parentIndex === undefined) {
              const fileDirname = path.dirname(context.getPhysicalFilename());
              fs.openSync(path.join(fileDirname, '..', 'index.ts'), 'w');
              parentIndex = path.join(fileDirname, '..', 'index.ts');
            }
            const file = fs.readFileSync(parentIndex);
            const regExp = new RegExp(`${getDirname()}`);
            if (regExp.test(file.toString())) return;
            fs.appendFileSync(parentIndex, `export { ${getDirname()} } from './${getDirname()}';\n`)
          }
        })
      }
    };
  },
};
