import { readFile, readdir } from "fs/promises";
import fs from "fs";
import path from "path";

export const SUPPORTED_FORMATS = {
  ".ttf": "truetype",
  ".otf": "sfnt",
  ".woff": "woff",
  ".woff2": "woff2",
};

export const FONT_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2", ".eot"];

/**
 * Load a CSS file as text
 * @param {string} path Path to the css file
 * @returns {string} The content of the CSS file
 */
export async function loadCSSFile(path) {
  return await readFile(path, "utf8");
}

/**
 *
 * @param {string} dir Path to the directory to search
 * @param {string} expr Regular expression to search in the files
 * @param {array} excluded An array of patterns (strings or regular expressions) to exclude files and directories from the search. If a file or directory name matches any of the patterns in this array, it will be skipped during the search.
 * @returns {array} An array of unique matches found in the files of the directory and its subdirectories that match the regular expression provided in expr, excluding any files or directories that match the patterns in the excluded array.
 */
export async function findExprInDir(dir, expr, excluded = []) {
  const results = new Set();

  async function walk(currentPath) {
    const normalized = path.normalize(currentPath);
    const entries = await readdir(normalized, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(normalized, entry.name);

      if (isExcluded(fullPath, excluded)) {
        continue;
      }

      // If the entry is a directory, recursively walk it
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      // If the entry is a file, read its content and search for matches
      if (entry.isFile() && isTextFile(fullPath)) {
        const content = await readFile(fullPath, "utf8");

        const matches = content.match(expr);

        if (matches) {
          matches.forEach((m) => results.add(m));
        }
      }
    }
  }

  await walk(dir);
  return Array.from(results);
}

/**
 *
 * @param {string} dir Path to the directory to search
 * @param {string} expr Regular expression to search in the files.
 * @returns
 */
export async function findFilesInDir(dir, expr) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      continue;
    }

    if (entry.isFile()) {
      const matches = entry.name.match(expr);

      if (matches) {
        results.push(entry.name);
      }
    }
  }

  return results;
}

/**
 * Determine if a directory name matches any of the patterns in patters
 * @param {string} value Path to the directory or file to check
 * @param {array} patters An array of patterns (strings or regular expressions) to check against the directory name
 * @returns true if the directory name matches any of the patterns in patters, false otherwise
 */
export function isExcluded(value, patters) {
  return patters.some((item) => {
    if (item instanceof RegExp) {
      return item.test(value);
    } else if (typeof item === "string") {
      return path.normalize(value).endsWith(path.normalize(item));
    }
  });
}

/**
 * Return true if the file at filePath is a text file, false otherwise. This function reads the first 512 bytes of the file and checks for null bytes (0). If any null byte is found, it is likely a binary file, and the function returns false. If no null bytes are found, it is likely a text file, and the function returns true.
 * @param {string} filePath Path to the file to check
 * @returns {boolean} true if the file is a text file, false otherwise
 */
export function isTextFile(filePath) {
  const buffer = fs.readFileSync(filePath, { encoding: null, flag: "r" }).subarray(0, 512);

  for (const byte of buffer) {
    if (byte === 0) return false;
  }

  return true;
}

/**
 * Parse a file size in bytes and return a human-readable string with the appropriate unit (B, KB, MB). 
 * @param {number} size The size of the file in bytes
 * @returns {string} A human-readable string representing the file size with the appropriate unit (B, KB, MB)
 */
export function parseFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}
