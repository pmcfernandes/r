"use strict";

import './base.js';
import { provide, controller } from "./mvc/di.js";
import { createScope } from "./mvc/scope.js";
import { compile } from "./mvc/directive.js";
import { includesReady } from "./directives/x-include-html.js";

; (() => {

  /**
   * Compile a subtree against a fresh root scope and run the first digest.
   * @param {Element|Document} [root] - Where to start linking; defaults to the whole document.
   */
  function bootstrap(root = document) {
    // root controller(s) or implicit root scope
    const rootScope = createScope({});
    // Compile entire document; nested x-controller will create child scopes
    compile(root, rootScope);
    rootScope.$digest();
  }

  // Expose API (Object.assign: $.extend would replace the $ function with a plain object)
  Object.assign(window.$, { provide, controller, bootstrap });
  window.$.provide('Logger', { log: (...a) => console.log('[Log]', ...a) });

  // Auto-boot after x-include-html fragments have been fetched
  includesReady.then(() => bootstrap());
})();
