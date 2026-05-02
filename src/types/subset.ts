import { SUPPORTED_FORMATS } from "../utils.js";
import { LibSourceExp, LibSourceFiles } from "./config.js";

export interface SubsetConfig {
  origin: LibSourceFiles;
  expression: LibSourceExp;
  selector: (input: string, context?: unknown) => string;
  property?: string;
  source: string | Array<string>;
  dest?: string;
  additional?: string | Array<string>;
  excluded: Array<string | RegExp>;
}

export type FontTarget = typeof SUPPORTED_FORMATS[keyof typeof SUPPORTED_FORMATS];
