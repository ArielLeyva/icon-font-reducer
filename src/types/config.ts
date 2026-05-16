export interface LibSourceFiles {
  css?: string | null;
  fonts?: string;
}

export interface LibSourceExp {
  classes: RegExp;
  files: RegExp;
}

export interface LibSource {
  id?: string;
  name: string;
  origin: LibSourceFiles;
  expression: LibSourceExp;
  selector: (input: string, context?: unknown) => string;
  property?: string;
}

export interface IconFontReducerConfig {
  lib?: string | LibSource;
  source?: string | Array<string>;
  dest?: string;
  additional?: string | Array<string>;
  excluded?: string | Array<string | RegExp>;
  origin?: LibSourceFiles;
  property?: string;
}

export interface IconFontReducerFlags {
  config?: string;
  lib?: string;
  source?: string;
  dest?: string;
  origin?: LibSourceFiles;
  property?: string;
  additional?: string;
  excluded?: string;
}

export type ConfigKey = keyof IconFontReducerConfig;