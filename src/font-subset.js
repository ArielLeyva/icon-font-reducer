import subsetFont from "subset-font";
import fs from "fs";
import path from "path";

import { parseFileSize, SUPPORTED_FORMATS } from "./utils.js";

/**
 * Remove leading and trailing quotes, backslashes, and convert hexadecimal codes to characters.
 * @param {array<string>} codes Array of codes to normalize
 * @returns {String} Normalized string of characters corresponding to the codes
 */
export function getGlyphsFromCodes(codes) {
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
 * @param {String} sourceFontFile Path to the source font file
 * @returns {ext: String, target: String} Object containing the file extension and the corresponding target format for subset-font
 */
function getFontTarget(sourceFontFile) {
  const ext = path.extname(sourceFontFile).toLowerCase();

  if (!SUPPORTED_FORMATS[ext]) {
    throw new Error(`Unsupported font extension: ${ext}`);
  }

  return SUPPORTED_FORMATS[ext];
}

/**
 * Write a new font file with only the specified codes from the source font file.
 * @param {string} sourceFontFile Path to the source font file
 * @param {string} destFontFile Path to the destination font file
 * @param {array<string>} codes Array of codes to include in the subset font. Each code should be a string like "F0009" (hexadecimal).
 */
export async function subsetFontFromCodes(sourceFontFile, destFontDir, codes) {
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
