import { createFont, woff2 } from "fonteditor-core";
import fs from "fs";

/**
 * Convert an array of glyph codes to a string of characters. The function removes leading and trailing quotes, backslashes, and converts hexadecimal codes to characters.
 * @param {string} filePath Path to the font file
 * @param {Array<string>} classes Array of class names to extract glyph names from
 * @param selector The selector function to use to extract glyph names from classes
 * @returns {String} A string of characters corresponding to the glyph codes
 */
export async function getCodesFromGlyphNames(filePath: string, classes: Array<string>, selector: Function): Promise<Array<string>> {
  await woff2.init();

  const buffer = fs.readFileSync(filePath);

  const font = createFont(buffer, {
    type: "woff2",
  });

  const result: Array<string> = [];

  for (const item of classes) {
    const glyphName = selector(item);

    const glyph = font.find({
      filter(glyf) {
        return glyf.name === glyphName;
      },
    });

    if (!glyph.length) {
      continue;
    }

    result.push(glyph[0].unicode[0].toString(16));
  }

  return result;
}
