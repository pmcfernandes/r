"use strict";

(async () => {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => includeHTML());
  } else {
    includeHTML();
  }
})();
