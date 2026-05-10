import inquirer from "inquirer";
import { readdir, access } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

import { AVAILABLE_LIBS } from "./sources.js";
import { isExcluded } from "./utils.js";
import { ConfigKey, IconFontReducerConfig, IconFontReducerFlags, LibSource } from "./types/config.js";
import { SubsetConfig } from "./types/subset.js";

const SUPPORTED_FLAGS = ["config", "lib", "source", "dest", "origin.css", "origin.fonts", "additional", "property"];

const EXCLUDED_DIRS = [/^node_modules$/, /^dist$/, /^build$/, /^vendor$/, /^assets$/, /^\.git$/, /^\.vscode$/, /^\.idea$/];

const EXCLUDED_FILES = [/\.css$/];

const COMMON_CONFIG_ROUTES = ["/icon-font-reducer-config.js", "/icon-font-reducer-config.ts"];

/**
 * Build a configuration Object to subset the icons based on the command line arguments, a configuration file or user input.
 * @returns {Object} All configuration to subset icons
 */
export async function getConfig(): Promise<SubsetConfig> {
  const config = await loadBaseConfig(false);

  const context: SubsetConfig = {
    origin: config.origin!,
    expression: {
      classes: /[]/,
      files: /[]/,
    },
    selector: () => "",
    property: config.property,
    source: config.source != undefined ? (typeof config.source == "string" ? [config.source] : config.source) : [],
    dest: config.dest,
    additional: config.additional != undefined ? (typeof config.additional == "string" ? [config.additional] : config.additional) : [],
    excluded: config.excluded != undefined ? (typeof config.excluded == "string" ? [config.excluded] : config.excluded) : EXCLUDED_FILES,
  };

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
  if (source == undefined) {
    throw new Error("The icon font reducer configuration could not be read for the library. Please check the available libraries at https://github.com/ArielLeyva/icon-font-reducer#available-libs.");
  }

  // Set expression and selector from source
  context.expression = source!.expression;
  context.selector = source!.selector;

  if (config.origin!.css == undefined) {
    context.origin.css = await getCSSOrigin(true, config, source!);
  }
  if (config.origin!.fonts == undefined) {
    context.origin.fonts = await getFontsOrigin(true, config, source!);
  }

  // Select source from user input if not provided in flags or config file
  if (config.source == undefined || config.source.length == 0) {
    const currentPath = process.cwd();
    const entries = await readdir(currentPath, { withFileTypes: true });

    const answers = await inquirer.prompt([
      {
        type: "checkbox",
        name: "source",
        message: `Select the files and directories to scan for ${source!.name} icon usage:`,
        choices: entries
          .filter((entry) => !entry.isDirectory() || !isExcluded(entry.name, EXCLUDED_DIRS))
          .map((entry) => ({
            name: entry.name,
            value: path.join(currentPath, entry.name),
            default: true,
          })),
      },
    ]);

    context.source = answers.source;
  }

  // Set property if provided not in flags or config file
  if (config.property == undefined) {
    context.property = source!.property ?? "content";
  }

  return context;
}

export async function getNonIntercativeConfig() {
  const config = await loadBaseConfig(true);

  const context: SubsetConfig = {
    origin: config.origin!,
    expression: {
      classes: /[]/,
      files: /[]/,
    },
    selector: () => "",
    property: config.property,
    source: config.source != undefined ? (typeof config.source == "string" ? [config.source] : config.source) : [],
    dest: config.dest,
    additional: config.additional != undefined ? (typeof config.additional == "string" ? [config.additional] : config.additional) : [],
    excluded: config.excluded != undefined ? (typeof config.excluded == "string" ? [config.excluded] : config.excluded) : EXCLUDED_FILES,
  };

  if (config.lib == undefined) {
    throw new Error("Provide a valid icon library id for Icon Font Reducer. Visit https://github.com/ArielLeyva/icon-font-reducer#available-libs to see the available libraries");
  }

  // Load source from config (from AVAILABLE_LIBS if it's a string or directly from config if it's an object)
  const source = typeof config.lib == "string" ? AVAILABLE_LIBS.find((lib) => lib.id === config.lib) : config.lib;
  if (source == undefined) {
    throw new Error("The icon font reducer configuration could not be read for the library. Please check the available libraries at https://github.com/ArielLeyva/icon-font-reducer#available-libs.");
  }

  // Set expression and selector from source
  context.expression = source!.expression;
  context.selector = source!.selector;

  if (config.origin!.css == undefined) {
    context.origin.css = await getCSSOrigin(false, config, source!);
  }
  if (config.origin!.fonts == undefined) {
    context.origin.fonts = await getFontsOrigin(false, config, source!);
  }

  // Set property if provided not in flags or config file
  if (config.property == undefined) {
    context.property = source!.property ?? "content";
  }

  return context;
}

/**
 * Load base configuration provide by config file and flags
 * @param {boolean} silent Pass true to disable validation of unsupported flags
 * @returns {IconFontReducerConfig} Base config (provide by config file and flags)
 */
async function loadBaseConfig(silent: boolean): Promise<IconFontReducerConfig> {
  let config: IconFontReducerConfig = {};

  const flags = parseFlags(silent);
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
  for (const key of Object.keys(flags) as ConfigKey[]) {
    const value = flags[key];

    if (value !== undefined) {
      config[key] = value as any;
    }
  }

  // Initialize origin object if not provided in flags or config file
  if (config.origin == undefined) {
    config.origin = {};
  }

  return config;
}

/**
 * Load configuration from a JavaScript file.
 * The file should export a default object containing the configuration.
 * @param {string} filePath Path to the configuration file
 * @returns {IconFontReducerConfig} Configuration passed in config file
 */
async function loadConfigFromFile(filePath: string): Promise<IconFontReducerConfig> {
  const url = pathToFileURL(filePath).href;
  const module = await import(url);
  return module.default;
}

/**
 * Parse command line arguments into an object of flags
 * @param {boolean} silent Pass true to disable validation of unsupported flags
 * @returns An object containing the parsed flags from the command line arguments
 */
export function parseFlags(silent: boolean): IconFontReducerFlags {
  const args = process.argv.slice(2);
  const flags = {};

  for (const arg of args) {
    if (arg.startsWith("--")) {
      // Get flag and value
      const [flag, value] = arg.replace(/^--/, "").split("=");

      if (SUPPORTED_FLAGS.includes(flag)) {
        // Separate nested keys by dot notation and build the flags object accordingly
        const keys = flag.split(".");
        let current: any = flags;
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
        if (!silent) {
          throw new Error(`Unsupported flag: --${flag}. Supported flags are: ${SUPPORTED_FLAGS.map((f) => `--${f}`).join(", ")}`);
        }
      }
    }
  }
  return flags as IconFontReducerFlags;
}

/**
 * Select source from user input if not provided in flags or config file
 * @param intercative Passing `true` disables user interaction. If you pass `true` and the source path cannot be read from the configuration or flags, it will return an error.
 * @param config The configuration to use for reading the source path, if it exists
 * @param source The specific configuration of the library to use
 * @returns The source path of the CSS or SCSS file
 */
async function getCSSOrigin(intercative: boolean, config: IconFontReducerConfig, source: LibSource): Promise<string | undefined> {
  // Load source from user input if not provided in flags or config file
  if (typeof config.lib == "object" || typeof config.lib == "string") {
    // If the lib is directly provided as an object in the config file, use its origin values without asking the user
    return source!.origin.css;
  } else {
    if (intercative) {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "css",
          message: `CSS file path for ${source!.name} (empty to use the default value):`,
          default: source!.origin.css,
        },
      ]);
      return answer.css;
    } else {
      throw new Error("The path to the CSS or SCCS file for the icon font reducer library could not be read.");
    }
  }
}

/**
 * Select source from user input if not provided in flags or config file
 * @param intercative Passing `true` disables user interaction. If you pass `true` and the source path cannot be read from the configuration or flags, it will return an error.
 * @param config The configuration to use for reading the source path, if it exists
 * @param source The specific configuration of the library to use
 * @returns The source path of fonts directory
 */
async function getFontsOrigin(intercative: boolean, config: IconFontReducerConfig, source: LibSource): Promise<string | undefined> {
  if (typeof config.lib == "object" || typeof config.lib == "string") {
    // If the lib is directly provided as an object in the config file, use its origin values without asking the user
    return source!.origin.fonts;
  } else {
    if (intercative) {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "fonts",
          message: `Enter the ${source!.name} icon font files directory (empty to use the default value):`,
          default: source!.origin.fonts,
        },
      ]);
      return answer.fonts;
    } else {
      throw new Error("The path to the fonts directory for the icon font reducer library could not be read.");
    }
  }
}
