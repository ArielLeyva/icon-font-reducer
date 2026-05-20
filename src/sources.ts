import { LibSource } from "./types/config.js";

export const MATERIAL_DESIGN: LibSource = {
  id: "materialdesign",
  name: "Material Design",
  origin: {
    css: "node_modules/@mdi/font/css/materialdesignicons.min.css",
    fonts: "node_modules/@mdi/font/fonts/",
  },
  expression: { classes: /mdi-[a-z0-9-]+/gi, files: /materialdesignicons-[a-z0-9-]+/gi },
  selector: (cls: string) => `.${cls}::before`,
};

export const BOOTSTRAP: LibSource = {
  id: "bootstrap",
  name: "Bootstrap",
  origin: {
    css: "node_modules/bootstrap-icons/font/bootstrap-icons.min.css",
    fonts: "node_modules/bootstrap-icons/font/fonts",
  },
  expression: { classes: /bi-[a-z0-9-]+/gi, files: /bootstrap-icons+/gi },
  selector: (cls: string) => `.${cls}::before`,
};

export const REMIX: LibSource = {
  id: "remix",
  name: "Remix",
  origin: {
    css: "node_modules/remixicon/fonts/remixicon.css",
    fonts: "node_modules/remixicon/fonts",
  },
  expression: { classes: /ri-[a-z0-9-]+/gi, files: /remixicon\.(?:eot|ttf|woff2|woff)\b/gi },
  selector: (cls: string) => `.${cls}:before`,
};

export const COREUI_LINEAR: LibSource = {
  id: "coreui-linear",
  name: "CoreUI (Linear Icons)",
  origin: {
    css: "node_modules/@coreui/icons/scss/free/_icons.scss",
    fonts: "node_modules/@coreui/icons/fonts/",
  },
  expression: { classes: /cil-[a-z0-9-]+/gi, files: /CoreUI-Icons-Free\.[a-z0-9-]+/gi },
  selector: (cls: string) => `.${cls}:before`,
};

export const COREUI_BRAND: LibSource = {
  id: "coreui-brand",
  name: "CoreUI (Brand Icons)",
  origin: {
    css: "node_modules/@coreui/icons/scss/brand/_icons.scss",
    fonts: "node_modules/@coreui/icons/fonts/",
  },
  expression: { classes: /cil-[a-z0-9-]+/gi, files: /CoreUI-Icons-Brand\.[a-z0-9-]+/gi },
  selector: (cls: string) => `.${cls}:before`,
};

export const FONT_AWESOME_FREE: LibSource = {
  id: "font-awesome-free",
  name: "Font Awesome (Free)",
  origin: {
    css: "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
    fonts: "node_modules/@fortawesome/fontawesome-free/webfonts/",
  },
  expression: { classes: /fa-[a-z0-9-]+/gi, files: /fa\-[a-z0-9-]+/gi },
  selector: (cls: string) => `.${cls}`,
  property: "--fa",
};

export const LINE_AWESOME: LibSource = {
  id: "line-aswesome",
  name: "Line Aswesome",
  origin: {
    css: "node_modules/line-awesome/dist/line-awesome/css/line-awesome.css",
    fonts: "node_modules/line-awesome/dist/line-awesome/fonts/",
  },
  expression: { classes: /la-[a-z0-9-]+/gi, files: /la\-[a-z0-9-]+/gi },
  selector: (cls: string) => `.${cls}:before`,
};

export const LINE_ICONS: LibSource = {
  id: "line-icons",
  name: "Line Icons",
  origin: {
    css: "node_modules/lineicons/dist/lineicons.css",
    fonts: "node_modules/lineicons/dist/",
  },
  expression: { classes: /lni-[a-z0-9-]+/gi, files: /[a-z0-9-]+/gi },
  selector: (cls: string) => `.${cls}::before`,
};

export const LUCIDE: LibSource = {
  id: "lucide-static",
  name: "Lucide Icons (Static)",
  origin: {
    css: "node_modules/lucide-static/font/lucide.css",
    fonts: "node_modules/lucide-static/font/",
  },
  expression: { classes: /icon-[a-z0-9-]+/gi, files: /lucide\.[a-z0-9-]+/gi },
  selector: (cls: string) => `.${cls}::before`,
};

export const MATERIAL_SYMBOLS_OUTLINED: LibSource = {
  id: "material-symbols-outlined",
  name: "Material Symbols (Outlined)",
  origin: {
    css: null,
    fonts: "node_modules/material-symbols/",
  },
  expression: { classes: /<span\b[^>]*\bclass\s*=\s*["'][^"']*\bmaterial-symbols-outlined\b[^"']*["'][^>]*>(.*?)<\/span>/gis, files: /material-symbols-outlined\.[a-z0-9-]+/gi },
  selector: (span: string) => {
    const regex = /<span\b([^>]*)>(.*?)<\/span>/is;
    const match = span.match(regex);
    if (!match) return "";

    const attrs = match[1];
    const content = match[2];

    const classMatch = attrs.match(/class\s*=\s*["']([^"']*)["']/i);
    if (!classMatch) return "";

    const classes = classMatch[1].split(/\s+/);
    if (!classes.includes("material-symbols-outlined")) return "";

    return content.trim();
  },
};

export const MATERIAL_SYMBOLS_ROUNDED: LibSource = {
  id: "material-symbols-rounded",
  name: "Material Symbols (Rounded)",
  origin: {
    css: null,
    fonts: "node_modules/material-symbols/",
  },
  expression: { classes: /<span\b[^>]*\bclass\s*=\s*["'][^"']*\bmaterial-symbols-rounded\b[^"']*["'][^>]*>(.*?)<\/span>/gis, files: /material-symbols-rounded\.[a-z0-9-]+/gi },
  selector: (span: string) => {
    const regex = /<span\b([^>]*)>(.*?)<\/span>/is;
    const match = span.match(regex);
    if (!match) return "";

    const attrs = match[1];
    const content = match[2];

    const classMatch = attrs.match(/class\s*=\s*["']([^"']*)["']/i);
    if (!classMatch) return "";

    const classes = classMatch[1].split(/\s+/);
    if (!classes.includes("material-symbols-rounded")) return "";

    return content.trim();
  },
};

export const MATERIAL_SYMBOLS_SHARP: LibSource = {
  id: "material-symbols-sharp",
  name: "Material Symbols (Sharp)",
  origin: {
    css: null,
    fonts: "node_modules/material-symbols/",
  },
  expression: { classes: /<span\b[^>]*\bclass\s*=\s*["'][^"']*\bmaterial-symbols-sharp\b[^"']*["'][^>]*>(.*?)<\/span>/gis, files: /material-symbols-sharp\.[a-z0-9-]+/gi },
  selector: (span: string) => {
    const regex = /<span\b([^>]*)>(.*?)<\/span>/is;
    const match = span.match(regex);
    if (!match) return "";

    const attrs = match[1];
    const content = match[2];

    const classMatch = attrs.match(/class\s*=\s*["']([^"']*)["']/i);
    if (!classMatch) return "";

    const classes = classMatch[1].split(/\s+/);
    if (!classes.includes("material-symbols-sharp")) return "";

    return content.trim();
  },
};

export const AVAILABLE_LIBS = [MATERIAL_DESIGN, BOOTSTRAP, REMIX, COREUI_LINEAR, COREUI_BRAND, FONT_AWESOME_FREE, LINE_AWESOME, LINE_ICONS, LUCIDE, MATERIAL_SYMBOLS_OUTLINED, MATERIAL_SYMBOLS_ROUNDED, MATERIAL_SYMBOLS_SHARP];
