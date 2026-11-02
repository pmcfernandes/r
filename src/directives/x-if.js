import { safeEval } from "../mvc/scope.js";
import { directive, compile } from "../mvc/directive.js";

directive('x-if', 85, el => el.hasAttribute('x-if'),
  /**
   * Conditionally render a subtree: the element is replaced by a comment
   * placeholder, and a clone of the stored template is compiled and inserted
   * only while the expression is truthy.
   * @param {Element} el - Element carrying the `x-if` attribute (the condition).
   * @param {Object} $scope - Scope the condition and the cloned subtree share.
   */
  (el, $scope) => {
    const expr = el.getAttribute('x-if');
    if (!el._template) {
      el._template = el.cloneNode(true);
      el._template.removeAttribute('x-if');
      el._placeholder = document.createComment('x-if placeholder');
      el.parentNode.insertBefore(el._placeholder, el);
      el.remove();
    }
    const parent = el._placeholder.parentNode;
    /**
     * Insert or remove the instance so it matches the current condition.
     */
    function render() {
      const cond = safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope));
      const exists = !!el._instance;
      if (cond && !exists) {
        const clone = el._template.cloneNode(true);
        el._instance = clone;
        // Insert before compiling: compile() only walks children of connected nodes
        parent.insertBefore(clone, el._placeholder.nextSibling);
        compile(clone, $scope);
      } else if (!cond && exists) {
        el._instance.remove();
        el._instance = null;
      }
    }
    $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), render);
    render();
  });
