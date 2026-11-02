import { provide, resolve, controllers } from "../mvc/di.js";
import { createScope } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

// x-controller (priority high so the child scope exists before any other
// directive on this element is linked)
directive('x-controller', 1000, el => el.hasAttribute('x-controller'),
  /**
   * Create a child scope for the element, instantiate the named controller into
   * it, and expose that scope to the rest of the element and its children.
   * @param {Element} el - Element carrying the `x-controller` attribute.
   * @param {Object} parentScope - Enclosing scope; the child inherits from it via the prototype chain.
   * @returns {Object} The child scope for this controller's subtree.
   * @throws {Error} When no controller is registered under the given name.
   */
  (el, parentScope) => {
    const name = el.getAttribute('x-controller');
    const def = controllers.get(name);
    if (!def) throw new Error('Controller not found: ' + name);

    // child scope that inherits via prototype
    const childScope = createScope(Object.create(parentScope || {}));

    // injectables
    provide('$element', el);
    provide('$scope', childScope);
    const args = resolve(def.deps, { $element: el, $scope: childScope });
    def.factory(...args);

    // Children are linked after this returns, so digest in a microtask once the
    // whole subtree has been linked
    queueMicrotask(() => childScope.$digest());

    // Returning the scope tells compile() to link the remaining directives on
    // this element and all children against childScope (no re-compile needed,
    // which previously recursed infinitely)
    return childScope;
  });
