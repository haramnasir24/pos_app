**When updating inventory, you need four key pieces of information: the item's variation ID (to identify the specific product), the inventory state change, the location ID (to specify which store), and a timestamp (to track when the change happened).**

**Step 6: Product Data Fetching**
Add infinite scrolling or pagination

**Step 7: Search & Filtering**
Create filter options (category, price range, etc.)

**Step 10: Optimize Performance**
Implement proper loading states
Add skeleton screens for better perceived performance
Optimize images and implement lazy loading


**BABEL:** 
A JavaScript compiler/transpiler. It converts modern JavaScript (ES6+, JSX, TypeScript, etc.) into older JavaScript that all browsers can understand.

**webpack**
A module bundler. It takes your JavaScript (and other assets like CSS, images, etc.), processes them, and bundles them into one or more files for the browser.

Setting "type": "module" in your package.json tells Node.js to treat your JavaScript files as ECMAScript modules (ESM) by default, instead of CommonJS modules

**ESM** stands for **ECMAScript Modules**.

**In short:**  
ESM is the official, modern JavaScript module system standardized in ECMAScript (the language spec behind JavaScript).

**Key points:**
- Uses `import` and `export` keywords:
  ```js
  // Exporting
  export function foo() {}
  // Importing
  import { foo } from './foo.js';
  ```
- Supported natively in browsers and Node.js (with `"type": "module"` in package.json).
- Allows for static analysis, tree-shaking, and better optimization.
- Replaces older systems like CommonJS (`require`, `module.exports`).

**Summary:**  
ESM is the standard way to organize and share code between JavaScript files using `import`/`export`

Tree shaking is a process used by JavaScript bundlers (like Webpack, Rollup, and esbuild) to remove unused code from your final bundle.