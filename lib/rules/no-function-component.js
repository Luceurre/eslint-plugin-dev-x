/**
 * @fileoverview disable the use of non-arrow function as react component
 * @author Pierre Glandon
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "disable the use of non-arrow function as react component",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
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
      FunctionDeclaration: (node) => {
        const functionReturnType = node?.returnType?.typeAnnotation?.typeName

        if (functionReturnType?.left?.name === "JSX" && functionReturnType?.right?.name === "Element") {
          context?.report({
            node: node,
            message: "Unauthorized function component.",
          });
        }
      }
    };
  },
};
