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

export const AVAILABLE_LIBS = [MATERIAL_DESIGN, BOOTSTRAP];
