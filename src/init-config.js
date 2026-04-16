import inquirer from "inquirer";
import { readdir, access } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

import { AVAILABLE_LIBS } from "./sources.js";
import { isExcluded } from "./utils.js";

const SUPPORTED_FLAGS = ["config", "lib", "source", "dest", "origin.css", "origin.fonts", "additional"];

const EXCLUDED_DIRS = [/^node_modules$/, /^dist$/, /^build$/, /^vendor$/, /^assets$/, /^\.git$/, /^\.vscode$/, /^\.idea$/];

const EXCLUDED_FILES = [/\.css$/];

const COMMON_CONFIG_ROUTES = ["/icon-font-reducer-config.js", "/icon-font-reducer-config.ts"];

/**
 * Build a configuration Object to subset the icons based on the command line arguments, a configuration file or user input.
 * @returns {Object} All configuration to subset icons
 */
export async function getConfig() {
  let config = {};

  const flags = parseFlags();
  if (flags.config) {
    // Load config from file if provided in flags
    config = await loadConfigFromFile(flags.config);
  } else {
    // Load config from common config files if exists
    for (const route of COMMON_CONFIG_ROUTES) {
      const fullPath = path.join(process.cwd(), route);
      try {
        await access(fullPath);
        config = await loadConfigFromFile(fullPath);
        break;
      } catch {}
    }
  }

  // Merge flags from command line arguments
  for (const key in flags) {
    config[key] = flags[key];
  }

  // Load source from user input if not provided in flags or config file
  if (config.lib == undefined) {
    const answer = await inquirer.prompt([
      {
        type: "select",
        name: "lib",
        message: "Select your lib:",
        choices: AVAILABLE_LIBS.map((lib) => ({ name: lib.name, value: lib.id })),
      },
    ]);
    config.lib = answer.lib;
  }

  // Load source from config (from AVAILABLE_LIBS if it's a string or directly from config if it's an object)
  const source = typeof config.lib == "string" ? AVAILABLE_LIBS.find((lib) => lib.id === config.lib) : config.lib;

  // Set expression and selector from source
  config.expression = source.expression;
  config.selector = source.selector;

  // Initialize origin object if not provided in flags or config file
  if (config.origin == undefined) {
    config.origin = {};
  }

  // Load source from user input if not provided in flags or config file
  if (config.origin.css == undefined) {
    if (typeof config.lib == "object") {
      // If the lib is directly provided as an object in the config file, use its origin values without asking the user
      config.origin.css = source.origin.css;
    } else {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "css",
          message: `CSS file path for ${source.name} (empty to use the default value):`,
          default: source.origin.css,
        },
      ]);
      config.origin.css = answer.css;
    }
  }

  // Select source from user input if not provided in flags or config file
  if (config.origin.fonts == undefined) {
    if (typeof config.lib == "object") {
      // If the lib is directly provided as an object in the config file, use its origin values without asking the user
      config.origin.fonts = source.origin.fonts;
    } else {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "fonts",
          message: `Enter the ${source.name} icon font files directory (empty to use the default value):`,
          default: source.origin.fonts,
        },
      ]);
      config.origin.fonts = answer.fonts;
    }
  }

  // Select source from user input if not provided in flags or config file
  if (config.source == undefined || config.source.length == 0) {
    const currentPath = process.cwd();
    const entries = await readdir(currentPath, { withFileTypes: true });

    const answers = await inquirer.prompt([
      {
        type: "checkbox",
        name: "source",
        message: `Select the files and directories to scan for ${source.name} icon usage:`,
        choices: entries
          .filter((entry) => !entry.isDirectory() || !isExcluded(entry.name, EXCLUDED_DIRS))
          .map((entry) => ({
            name: entry.name,
            value: path.join(currentPath, entry.name),
            default: true,
          })),
      },
    ]);

    config.source = answers.source;
  } else {
    // If source is provided as a string in flags or config file, convert it to an array
    if (typeof config.source === "string") {
      config.source = [config.source];
    }
  }

  // Set excluded patterns for files or directories if not provided in flags or config file
  if (config.excluded == undefined) {
    config.excluded = EXCLUDED_FILES;
  }

  // Set additional icons to include in the subset if its passed as a string in flags or config file
  if (config.additional != undefined && typeof config.additional === "string") {
    config.additional = [config.additional];
  }

  return config;
}

/**
 * Load configuration from a JavaScript file.
 * The file should export a default object containing the configuration.
 * @param {string} filePath Path to the configuration file
 * @returns
 */
async function loadConfigFromFile(filePath) {
  const url = pathToFileURL(filePath).href;
  const module = await import(url);
  return module.default;
}

/**
 * Parse command line arguments into an object of flags
 * @returns An object containing the parsed flags from the command line arguments
 */
export function parseFlags() {
  const args = process.argv.slice(2);
  const flags = {};

  for (const arg of args) {
    if (arg.startsWith("--")) {
      // Get flag and value
      const [flag, value] = arg.replace(/^--/, "").split("=");

      if (SUPPORTED_FLAGS.includes(flag)) {
        // Separate nested keys by dot notation and build the flags object accordingly
        const keys = flag.split(".");
        let current = flags;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (current[key] == undefined) {
            current[key] = {};
          }
          if (i === keys.length - 1) {
            current[key] = value ?? true;
          } else {
            current = current[key];
          }
        }
      } else {
        throw new Error(`Unsupported flag: --${flag}. Supported flags are: ${SUPPORTED_FLAGS.map((f) => `--${f}`).join(", ")}`);
      }
    }
  }
  return flags;
}
