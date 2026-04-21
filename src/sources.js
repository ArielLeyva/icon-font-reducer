export const MATERIAL_DESIGN = {
  id: "materialdesign",
  name: "Material Design",
  origin: {
    css: "node_modules/@mdi/font/css/materialdesignicons.min.css",
    fonts: "node_modules/@mdi/font/fonts/",
  },
  expression: { classes: /mdi-[a-z0-9-]+/gi, files: /materialdesignicons-[a-z0-9-]+/gi },
  selector: (cls) => `.${cls}::before`,
};

export const BOOTSTRAP = {
  id: "bootstrap",
  name: "Bootstrap",
  origin: {
    css: "node_modules/bootstrap-icons/font/bootstrap-icons.min.css",
    fonts: "node_modules/bootstrap-icons/font/fonts",
  },
  expression: { classes: /bi-[a-z0-9-]+/gi, files: /bootstrap-icons+/gi },
  selector: (cls) => `.${cls}::before`,
};

export const REMIX = {
  id: "remix",
  name: "Remix",
  origin: {
    css: "node_modules/remixicon/fonts/remixicon.css",
    fonts: "node_modules/remixicon/fonts",
  },
  expression: { classes: /ri-[a-z0-9-]+/gi, files: /remixicon\.(?:eot|ttf|woff2|woff)\b/gi },
  selector: (cls) => `.${cls}:before`,
};

export const COREUI_LINEAR = {
  id: "coreui-linear",
  name: "CoreUI (Linear Icons)",
  origin: {
    css: "node_modules/@coreui/icons/scss/free/_icons.scss",
    fonts: "node_modules/@coreui/icons/fonts/",
  },
  expression: { classes: /cil-[a-z0-9-]+/gi, files: /CoreUI-Icons-Free\.[a-z0-9-]+/gi },
  selector: (cls) => `.${cls}:before`,
};

export const COREUI_BRAND = {
  id: "coreui-brand",
  name: "CoreUI (Brand Icons)",
  origin: {
    css: "node_modules/@coreui/icons/scss/brand/_icons.scss",
    fonts: "node_modules/@coreui/icons/fonts/",
  },
  expression: { classes: /cil-[a-z0-9-]+/gi, files: /CoreUI-Icons-Brand\.[a-z0-9-]+/gi },
  selector: (cls) => `.${cls}:before`,
};

export const FONT_AWESOME_FREE = {
  id: "font-awesome-free",
  name: "Font Awesome (Free)",
  origin: {
    css: "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
    fonts: "node_modules/@fortawesome/fontawesome-free/webfonts/",
  },
  expression: { classes: /fa-[a-z0-9-]+/gi, files: /fa\-[a-z0-9-]+/gi },
  selector: (cls) => `.${cls}`,
  property: "--fa",
};

export const LINE_AWESOME = {
  id: "line-aswesome",
  name: "Line Aswesome",
  origin: {
    css: "node_modules/line-awesome/dist/line-awesome/css/line-awesome.css",
    fonts: "node_modules/line-awesome/dist/line-awesome/fonts/",
  },
  expression: { classes: /la-[a-z0-9-]+/gi, files: /la\-[a-z0-9-]+/gi },
  selector: (cls) => `.${cls}:before`,
};

export const AVAILABLE_LIBS = [MATERIAL_DESIGN, BOOTSTRAP, REMIX, COREUI_LINEAR, COREUI_BRAND, FONT_AWESOME_FREE, LINE_AWESOME];
