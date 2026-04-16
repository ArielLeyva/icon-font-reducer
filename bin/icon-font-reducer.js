#!/usr/bin/env node
import css from "css";
import inquirer from "inquirer";
import path from "path";

import { loadCSSFile, findExprInDir, findFilesInDir, SUPPORTED_FORMATS } from "../src/utils.js";
import { subsetFontFromCodes } from "../src/font-subset.js";
import { getConfig } from "../src/init-config.js";

console.log("Initializing font reducer...");

const config = await getConfig();

// Load the CSS file and parse it
const content = await loadCSSFile(config.origin.css);
const ast = css.parse(content);

// Find icons usage in the codebase
const classes = [];
for (const source of config.source) {
  const found = await findExprInDir(source, config.expression.classes, config.excluded);
  classes.push(...found);
}
// Add additional icons from config
if (config.additional) {
  classes.push(...config.additional);
}

// Find the content values for the used icons
const codes = [];
ast.stylesheet.rules.forEach((rule) => {
  for (const cls of classes) {
    // Find rules that match the source selector
    if (rule.selectors && rule.selectors.includes(config.selector(cls))) {
      // Extract the content value from the declarations
      rule.declarations.forEach((decl) => {
        if (decl.property === "content") {
          codes.push(decl.value);
        }
      });
    }
  }
});
console.log(`${codes.length} icons found in your code.`);

// Load font files in directory
console.log(`Find font files in the codebase...`);
const fontFiles = await findFilesInDir(config.origin.fonts, config.expression.files);
const items = fontFiles.map((file) => ({
  name: `${file}${Object.keys(SUPPORTED_FORMATS).includes(path.extname(file).toLowerCase()) ? "" : " (Not supported format)"}`,
  value: path.join(config.origin.fonts, file),
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

// Subset the selected font files
for (const file of answers.files) {
  const dest = config.dest ?? path.join(process.cwd(), "font-reducer-dest");
  await subsetFontFromCodes(file, dest, codes);
}

console.log(`${codes.length} icons saved in your font files.`);
