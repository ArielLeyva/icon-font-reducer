import subsetFont from "subset-font";
import fs from "fs";
import path from "path";

import { parseFileSize, SUPPORTED_FORMATS } from "./utils.js";
import { FontTarget } from "./types/subset.js";

/**
 * Remove leading and trailing quotes, backslashes, and convert hexadecimal codes to characters.
 * @param {Array<string>} codes Array of codes to normalize
 * @returns {String} Normalized string of characters corresponding to the codes
 */
export function getGlyphsFromCodes(codes: Array<string>): string {
  return codes
    .map((raw) => {
      // Remove leading and trailing quotes
      let clean = raw.replace(/^"+|"+$/g, "");

      // Remove backslashes
      clean = clean.replace(/\\/g, "");

      const codePoint = parseInt(clean, 16);
      if (isNaN(codePoint)) {
        console.warn("Invalid code:", raw);
        return "";
      }

      return String.fromCodePoint(codePoint);
    })
    .join("");
}

/**
 * Determine the target format for subset-font based on the source font file extension.
 * @param {string} sourceFontFile Path to the source font file
 * @returns {FontTarget} The font target for font file
 */
function getFontTarget(sourceFontFile: string): FontTarget {
  const ext = path.extname(sourceFontFile).toLowerCase();

  if (!(ext in SUPPORTED_FORMATS)) {
    throw new Error(`Unsupported font extension: ${ext}`);
  }

  return SUPPORTED_FORMATS[ext as keyof typeof SUPPORTED_FORMATS];
}

/**
 * Write a new font file with only the specified codes from the source font file.
 * @param {string} sourceFontFile Path to the source font file
 * @param {string} destFontDir Path to the destination font file
 * @param {Array<string>} codes Array of codes to include in the subset font. Each code should be a string like "F0009" (hexadecimal).
 */
export async function subsetFontFromCodes(sourceFontFile: string, destFontDir: string, codes: Array<string>) {
  const buffer = fs.readFileSync(sourceFontFile);

  const glyphs = getGlyphsFromCodes(codes);

  const target = getFontTarget(sourceFontFile);

  const subset = await subsetFont(buffer, glyphs, {
    targetFormat: target,
  });

  // Save file in destination folder
  fs.mkdirSync(destFontDir, { recursive: true });
  const name = path.basename(sourceFontFile);
  fs.writeFileSync(`${destFontDir}/${name}`, subset);

  // Log the file size reduction
  const sourceFontFileSize = fs.statSync(sourceFontFile).size;
  const destFontFileSize = fs.statSync(`${destFontDir}/${name}`).size;
  console.log(`${name}: ${parseFileSize(sourceFontFileSize)} -> ${parseFileSize(destFontFileSize)} (${((1 - destFontFileSize / sourceFontFileSize) * 100).toFixed(2)}% reduction)`);
}
