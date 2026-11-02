"use strict";

import { provide, controller } from "./mvc/di.js";
import { createScope } from "./mvc/scope.js";
import { compile } from "./mvc/directive.js";

; (() => {

  function bootstrap(root = document) {
    // root controller(s) or implicit root scope
    const rootScope = createScope({});
    // Compile entire document; nested x-controller will create child scopes
    compile(root, rootScope);
    rootScope.$digest();
  }

  // Expose API
  window.$ = window.$.extend(windows.$, { provide, controller, bootstrap });
  window.$.provide('Logger', { log: (...a) => console.log('[Log]', ...a) });

  // Auto-boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bootstrap());
  } else {
    bootstrap();
  }
})();

