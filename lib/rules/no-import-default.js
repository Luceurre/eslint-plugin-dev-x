/**
 * @fileoverview prevent default import outside index
 * @author Pierre Glandon
 */
"use strict";

const fs = require("fs");
const path = require('path');
const resolve = require('eslint-module-utils/resolve').default;
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: "prevent default import outside index",
            category: "Fill me in",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: "code", // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create(context) {
        const INDEX_FILENAME_REGEX = /index\.(js|ts)x?$/
        const EXTERNAL_MODULE_REGEX = /node_modules/

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const buildNamedExportRegex = (name) => new RegExp(`export const ${name}`)

        const isIndexFilename = () => {
            return INDEX_FILENAME_REGEX.test(context.getFilename());
        }

        const getImportDeclaration = () => {
            const ancestors = context.getAncestors()
            return ancestors[ancestors.length - 1]
        }

        const isExternalLibraryImport = () => {
            const {source} = getImportDeclaration();

            if (source.type === 'Literal') {
                return source.value[0] !== '.' && EXTERNAL_MODULE_REGEX.test(resolve(getImportDeclaration().source.value, context))
            }
        }

        const hasOtherImportSpecifier = () => {
            return getImportDeclaration().specifiers.length > 1;
        }

        const hasNamedExport = (name) => {
            const filePath = resolve(getImportDeclaration().source.value, context);
            if (filePath === undefined) return false;
            const file = fs.readFileSync(filePath);
            return buildNamedExportRegex(name).test(file.toString())
        }

        const getHighestNamedReexport = (node) => {
            const importDeclaration = getImportDeclaration();
            const fileDirname = path.dirname(importDeclaration.source.value);
            const indexPath = resolve(fileDirname, context);
            if (indexPath === undefined) return;
            const file = fs.readFileSync(indexPath);
            const reexportRegex = new RegExp(`${node.local.name}\\s`)
            if (reexportRegex.test(file.toString())) return indexPath;
        }

        const isCloseAndRelative = () => {
            const importDeclaration = getImportDeclaration();
            const importPath = importDeclaration.source.value;
            return importPath[0] === '.' && (importPath.match(/\//g) || []).length === 1;

        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDefaultSpecifier: (node) => {
                if (isIndexFilename() || isExternalLibraryImport() || isCloseAndRelative()) return;
                context.report({
                    node: node,
                    message:
                        "Unauthorized default import.",
                    fix: (fixer) => {
                        if (hasOtherImportSpecifier()) return;
                        const highestNamedReexport = getHighestNamedReexport(node);
                        const importDeclarationNode = getImportDeclaration();
                        if (highestNamedReexport) {
                            const importPathes = highestNamedReexport.split('/src/')
                            const importPath = importPathes[importPathes.length - 1]
                            return fixer.replaceText(importDeclarationNode, `import { ${node.local.name} } from '${importPath.split('/index')[0]}';`);
                        }

                        if (!hasNamedExport(node.local.name)) return;
                        return [fixer.insertTextBefore(node, '{'), fixer.insertTextAfter(node, '}')]
                    }
                });
            }
        };
    },
};
