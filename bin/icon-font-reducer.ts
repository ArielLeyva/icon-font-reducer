#!/usr/bin/env node
import path from "path";

import { findExprInDir } from "../src/utils.js";
import { getFontFiles, subsetFontFromCodes } from "../src/font-subset.js";
import { getConfig } from "../src/init-config.js";
import { extractGlyphsCodes, getParsedCss } from "../src/css-utils.js";

console.log("Initializing font reducer...");

const config = await getConfig();

// Find icons usage in the codebase
const classes: Array<string> = [];
for (const source of config.source) {
  const found = await findExprInDir(source, config.expression.classes, config.excluded);
  classes.push(...found);
}
// Add additional icons from config
if (config.additional) {
  classes.push(...config.additional);
}

// Load the CSS file and parse it
const ast = await getParsedCss(config.origin.css!);
const codes = extractGlyphsCodes(ast, classes, config.selector, config.property);
console.log(`${codes.length} icons found in your code.`);

// Load font files in directory
console.log(`Find font files in the codebase...`);

// Get destination folder
const dest = config.dest ?? path.join(process.cwd(), "icon-font-reducer-dest");

// Subset the selected font files
const fontFiles = await getFontFiles(config.origin.fonts!, config.expression.files);
for (const file of fontFiles) {
  await subsetFontFromCodes(file, dest, codes);
}

console.log(`${codes.length} icons saved in ${path.resolve(dest)}.`);
