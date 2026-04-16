
---
## Icon Font Reducer

<p align="center">
  <a href="https://www.npmjs.com/package/icon-font-reducer">
    <img src="https://img.shields.io/npm/v/icon-font-reducer.svg?style=flat-square" alt="npm version">
  </a>

  <img src="https://img.shields.io/badge/node-%3E%3D%2018.0.0-green.svg?style=flat-square" alt="Node Version">

  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="MIT License">
  </a>

  <a href="https://bundlephobia.com/package/icon-font-reducer">
    <img src="https://img.shields.io/bundlephobia/minzip/icon-font-reducer?style=flat-square" alt="Bundle Size">
  </a>
</p>

Icon Font Reducer removes unused icons from your project's icon font files, reducing the size of these files and consequently increasing your website's loading speed.

1. [Installation][installation]
1. [Usage examples][usage-examples]
1. [Available libs][available-libs]
1. [Configuration][configuration]
1. [Flags][flags]
    1. [Available flags][available-flags]
    1. [Config flag][config-flag]
1. [Working with a custom library][working-with-a-custom-library]

Icon Font Reducer is especially useful for icon libraries that use web fonts, particularly in legacy projects and libraries that haven't yet migrated to SVG sprites or more modern methods.

---

## Installation

Icon Font Reducer is distributed as a npm package.

```sh
npm install icon-font-reducer --save-dev
```

Add the command `icon-font-reducer` to your `package.json`

```json
{
  "scripts": {
    "icon-font-reducer": "icon-font-reducer"
  }
}
```

---

## Usage Examples

To reduce the size of your font files, run the following command:

```sh
npm run icon-font-reducer
```

The CLI will guide you through configuring which icon library you are using and which directories in your project will be scanned for the icons used. For example: 

```sh
npm run icon-font-reducer
Initializing font reducer...
✔ Select your lib: Bootstrap
✔ CSS file path for Bootstrap (empty to use the default value): node_modules/bootstrap-icons/font/bootstrap-icons.min.css    
✔ Enter the Bootstrap icon font files directory (empty to use the default value): node_modules/bootstrap-icons/font/fonts    
✔ Select the files and directories to scan for Bootstrap icon usage: test
123 icons found in your code.
Find font files in the codebase...
✔ Select the font files you want to subset: bootstrap-icons.woff, bootstrap-icons.woff2
bootstrap-icons.woff: 176.06 KB -> 11.34 KB (93.56% reduction)
bootstrap-icons.woff2: 130.90 KB -> 9.39 KB (92.83% reduction)
123 icons saved in your font files.
```

---

## Available libs

| Name | Lib ID |
|----------|-----------|
| [Material Design Icons](https://pictogrammers.com/library/mdi/) | `materialdesign` |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | `bootstrap` |
| [Remix Icons](https://remixicon.com/) | `remix` |

---

## Configuration

The Icon Font Reducer configuration must be provided through a .js or .ts file that exports a default module, for example:

```js
export default {
  lib: "materialdesign",
  source: "./src",
  dest: "./dist/icon-fonts-reduced",
  additional: ["mdi-menu", "mdi-menu-down", "mdi-chevron-left", "mdi-chevron-right", "mdi-chevron-down"],
  origin: {
    css: "src/assets/css/bootstrap-icons.min.css"
  }
};
```
> [!NOTE]
> Add an `icon-font-reducer-config.js` or `icon-font-reducer-config.ts` file to the root of your project with your custom configuration.

These are the available configuration properties:

| Key | Type | Description |
|-----------|-----------|-----------|
| `lib` | string or array | Specify the library you are using to render icons in your project. Review the [Available libs][available-libs] for more information. |
| `source` | string or array | Directory path(s) to scan for used icons from the specified library. It can be an absolute or relative path. |
| `dest` | string | Destination path for the reduced icon font files. It can be an absolute or relative path. |
| `additional` | string or array | CSS icon classes to be added to the icon font files. Icon Font Reducer detects the icons used in your project using regular expressions. Occasionally, depending on your code, this detection may not work for some icons, and you can manually pass the undetected icons to this configuration. |
| `excluded` | string or array | Icon Font Reducer excludes from scanning for your icons any files that cannot be read as text (such as binary files, images, audio, etc.). This setting specifies other files or directories to be excluded from the scan. You can use an array of regular expressions if needed. |
| `origin.css` | string | The CSS file of the icon library you are using. By default, Icon Font Reducer uses the file located in the `node_modules` directory of your library; you can specify a different path if needed (for example, when not using the npm ecosystem). |
| `origin.fonts` | string | Directory where the original (or unreduced) font files of your icon library are located. By default, Icon Font Reducer uses the directory located in `node_modules` of your library to locate these files; you can specify a different directory if necessary (for example, when you are not using the npm ecosystem). |

> [!NOTE]
> All configuration properties are optional.

---

## Flags

All configuration properties that can be represented as strings are also available as flags when running the `npm run icon-font-reducer` command. Here is a list of the available flags.

### Available flags

| Key | Description |
|-----------|-----------|
| `--lib` | Specify the library you are using to render icons in your project. Review the [Available libs][available-libs] for more information. |
| `--source` | Directory path(s) to scan for used icons from the specified library |
| `--dest` | Destination path for the reduced icon font files |
| `--origin.css` | The CSS file of the icon library you are using. By default, Icon Font Reducer uses the file located in the `node_modules` directory of your library; you can specify a different path if needed (for example, when not using the npm ecosystem). |
| `--origin.fonts` | Directory where the original (or unreduced) font files of your icon library are located. By default, Icon Font Reducer uses the directory located in `node_modules` of your library to locate these files; you can specify a different directory if necessary (for example, when you are not using the npm ecosystem). |

For example, this is how you can specify the output path for icon font files using the `--dest` flag

```sh
npm run icon-font-reducer --dest="./public/build/icons"
```

### Config flag

You can use the `--config` flag with an absolute or relative path to the configuration file you wish to use.

```sh
npm run icon-font-reducer --config="/config/icon-font-reducer.js"
```

---

## Working with a custom library

You can use Icon Font Reducer with other libraries that are not natively supported. To do this, you must specify an object in the `lib` property with the properties to define Icon Font Reducer's behavior. For example:

```js
export default {
  lib: {
    name: "Unsupported library",
    origin: {
      css: "node_modules/library-name/css/classes.css",
      fonts: "node_modules/library-name/fonts-files/",
    },
    expression: { classes: /my-icons-[a-z0-9-]+/gi, files: /library-name_webfont-[a-z0-9-]+/gi },
    selector: (cls) => `.${cls}::before`,
  },
};
```

These are all the properties you will need to define with examples using the [Bootstrap Icons](https://icons.getbootstrap.com/) library:

| Key | Type | Description | Example |
|-----------|-----------|-----------|-----------|
| `name` | string | The name of the library or your custom implementation. You are free to write any string here; Icon Font Reducer only uses it to give grammatical meaning to the console output. | "Boostrap Icons" |
| `origin.css` | string | The CSS file of the icon library you are using. | "node_modules/bootstrap-icons/font/bootstrap-icons.min.css" |
| `origin.fonts` | string | Directory where the original (or unreduced) font files of your icon library are located. The directory should contain all the font icon files that you need to reduce with Icon Font Reducer. | node_modules/bootstrap-icons/font/fonts |
| `expression.classes` | RegExp | Regular expression to find the icons used in your project. It must be a regular expression that matches the CSS class of the library. [Here][how-expressionclasses-works-in-bootstrap-icons] is a detailed explanation of this property. | /bi-[a-z0-9-]+/gi |
| `expression.files` | RegExp or undefined | Regular expression to find the original icon files in the library. This must be a regular expression that matches the filenames you need to reduce using Icon Font Reducer. You can leave it blank to list all files found in `origin.fonts` and then select the files you need to reduce via the console. [Here][how-expressionfiles-works-in-bootstrap-icons] is a detailed explanation of this property. | /bootstrap-icons+/gi |
| `selector` | Function(string) => string | A function that takes as an argument the name of the icon found in your project and returns the CSS selector where the CSS property "content" is located with the font glyph. [Here][how-selector-works-in-bootstrap-icons] is a detailed explanation of this property. | (cls) => `.${cls}::before` |

#### How `expression.classes` works in Bootstrap Icons

Bootstrap icons are used like this: `<i class="bi bi-0-circle"></i>`. 

The regular expression `/bi-[a-z0-9-]+/gi` matches all values ​​that begin with bi- followed by any lowercase letter, number, or hyphen character (`-`), in order to detect icons used in the project such as "bi-0-circle".

#### How `expression.files` works in Bootstrap Icons

Bootstrap font icon files are stored in `node_modules\bootstrap-icons\font\fonts` and are named `bootstrap-icons.woff` and `bootstrap-icons.woff2`.

The regular expression `/bootstrap-icons+/gi` matches the name of these files, so that when listing the files in the directory defined in `origin.fonts`, only those that match the regular expression are searched for.


#### How `selector` works in Bootstrap Icons

Bootstrap Icons uses the selector `.[class-name]::before` to define which icon should be displayed through the `content` property, for example for the `bi-0-circle` icon:

```css
.bi-0-circle::before { 
  content: "\f840"; 
}
```

The function defined in `selector` receives the text string that matched `expression.classes` when scanning your project for the icons used and returns a string with the CSS selector used by Bootstrap

```js
function(cls) {
  return `.${cls}::before`;
}
```

--- 

[installation]: #installation
[usage-examples]: #usage-examples
[available-libs]: #available-libs
[configuration]: #configuration
[flags]: #flags
[available-flags]: #available-flags
[config-flag]: #config-flag
[working-with-a-custom-library]: #working-with-a-custom-library
[how-expressionclasses-works-in-bootstrap-icons]: #how-expressionclasses-works-in-bootstrap-icons
[how-expressionfiles-works-in-bootstrap-icons]: #how-expressionfiles-works-in-bootstrap-icons
[how-selector-works-in-bootstrap-icons]: #how-selector-works-in-bootstrap-icons