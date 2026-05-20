import subsetFont from "subset-font";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";

import { findFilesInDir, parseFileSize, SUPPORTED_FORMATS } from "./utils.js";
import { FontTarget } from "./types/subset.js";

export const FONT_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2", ".eot"];

/**
 * Remove leading and trailing quotes, backslashes, and convert hexadecimal codes to characters.
 * @param {Array<string>} codes Array of codes to normalize
 * @returns {String} Normalized string of characters corresponding to the codes
 */
export function getGlyphsFromCodes(codes: Array<string>): string {
  return codes
    .map((raw) => {
      if (raw.startsWith("_")) {
        return raw.substring(1);
      }
      
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
 * Get a list of font files from a directory that match a given filter expression.
 * @param filesPath Path to the directory containing font files
 * @param filterExpr Regular expression to filter only font files
 * @param intercative If true, prompt the user to select which font files to subset. If false, return all matching font files without prompting.
 * @returns {Promise<Array<string>>} Array of paths to the selected font files
 */
export async function getFontFiles(filesPath: string, filterExpr: RegExp, intercative = true): Promise<Array<string>> {
  const files = await findFilesInDir(filesPath, filterExpr);
  const fontFiles = files.filter((file) => FONT_EXTENSIONS.includes(path.extname(file).toLowerCase()));

  if (intercative) {
    const items = fontFiles.map((file) => ({
      name: `${file}${Object.keys(SUPPORTED_FORMATS).includes(path.extname(file).toLowerCase()) ? "" : " (Not supported format)"}`,
      value: path.join(filesPath, file),
      default: true,
    }));

    // Prompt user to select font files to subset
    const answers = await inquirer.prompt([
      {
        type: "checkbox",
        name: "files",
        message: "Select the font files you want to subset:",
        choices: items,
      },
    ]);
    return answers.files;
  } else {
    return fontFiles.filter((file) => FONT_EXTENSIONS.includes(path.extname(file).toLowerCase())).map((file) => path.join(filesPath, file));
  }
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
  const subset = await getSubsetBuffer(sourceFontFile, codes);

  // Save file in destination folder
  fs.mkdirSync(destFontDir, { recursive: true });
  const name = path.basename(sourceFontFile);
  fs.writeFileSync(`${destFontDir}/${name}`, subset);

  // Log the file size reduction
  const sourceFontFileSize = fs.statSync(sourceFontFile).size;
  const destFontFileSize = fs.statSync(`${destFontDir}/${name}`).size;
  console.log(`${name}: ${parseFileSize(sourceFontFileSize)} -> ${parseFileSize(destFontFileSize)} (${((1 - destFontFileSize / sourceFontFileSize) * 100).toFixed(2)}% reduction)`);
}

/**
 * Get a subset of a font file with only the specified codes.
 * @param sourceFontFile Path to the source font file
 * @param codes Array of codes to include in the subset font. Each code should be a string like "F0009" (hexadecimal).
 * @returns A Promise resolving to the subset font buffer.
 */
export async function getSubsetBuffer(sourceFontFile: string, codes: Array<string>) {
  const buffer = fs.readFileSync(sourceFontFile);

  const glyphs = getGlyphsFromCodes(codes);

  const target = getFontTarget(sourceFontFile);

  return await subsetFont(buffer, glyphs, {
    targetFormat: target,
    noLayoutClosure: true,
  });
}
