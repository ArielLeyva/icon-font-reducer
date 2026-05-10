import css from "css";
import * as sass from "sass";
import { readFile } from "fs/promises";

/**
 * Load a CSS file as text
 * @param {string} path Path to the css file
 * @returns {string} The content of the CSS file
 */
export async function loadCSSFile(path: string): Promise<string> {
  return await readFile(path, "utf8");
}

/**
 * Return the AST of a CSS or SCSS file. If the file is a CSS file, it will be loaded as text and parsed with
 * the css package. If the file is a SCSS file, it will be compiled and then parsed with the css package.
 * @param path Path to CSS or SCSS file
 * @returns AST of a CSS or SCSS file
 */
export async function getParsedCss(path: string): Promise<css.Stylesheet> {
  const content = path.endsWith(".css") ? await loadCSSFile(path) : sass.compile(path).css;
  const ast: css.Stylesheet = css.parse(content);
  if (ast == undefined) {
    throw new Error("The CSS file could not be parsed.");
  }
  return ast;
}

/**
 * Extract the glyph codes from a CSS AST.
 * @param ast The CSS AST
 * @param classes The classes to extract the glyph codes from
 * @param selector The selector function to use
 * @param property The property to extract the glyph codes from
 * @returns An array of glyph codes
 */
export function extractGlyphsCodes(ast: css.Stylesheet, classes: string[], selector = (cls: string) => `.${cls}`, property = "content"): Array<string> {
  // Find the content values for the used icons
  const codes: Array<string> = [];
  ast.stylesheet!.rules.forEach((rule: any) => {
    for (const cls of classes) {
      // Find rules that match the source selector
      if (rule.selectors && rule.selectors.includes(selector(cls))) {
        // Extract the content value from the declarations
        rule.declarations.forEach((decl: any) => {
          if (decl.property === property) {
            codes.push(decl.value);
          }
        });
      }
    }
  });
  return codes;
}
