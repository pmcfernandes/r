"use strict";

/**
 * Fetch and inline every `[x-include-html]` fragment below `root`.
 * On success the attribute is removed; on failure the element shows an error message.
 * Nested includes inside fetched markup are processed recursively.
 * @param {Element|Document} [root] - Subtree to scan for include attributes.
 * @returns {Promise<void>} Resolves when all fragments below `root` are inlined.
 */
async function includeHTML(root = document) {
  const elements = root.querySelectorAll("[x-include-html]");
  for (const el of elements) {
    const file = el.getAttribute("x-include-html");
    if (file) {
      try {
        const resp = await fetch(file);
        if (!resp.ok) throw new Error(resp.statusText);
        const html = await resp.text();
        el.innerHTML = html;
        el.removeAttribute("x-include-html");
        // Recursively process nested includes
        await includeHTML(el);
      } catch (err) {
        el.innerHTML = `<p style="color:red;">Error loading ${file}</p>`;
      }
    }
  }
}

// Resolves once every x-include-html fragment is in the DOM, so bootstrap can
// compile the included markup instead of racing the fetches
/**
 * @type {Promise<void>}
 * Resolves when the document has finished parsing (if still loading) and every
 * `x-include-html` fragment has been fetched and inlined.
 */
const includesReady =
  document.readyState === "loading"
    ? new Promise(resolve => {
        document.addEventListener(
          "DOMContentLoaded",
          () => resolve(includeHTML()),
          { once: true }
        );
      })
    : includeHTML();

export { includeHTML, includesReady };
