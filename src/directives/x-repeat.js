import { safeEval } from "../mvc/scope.js";
import { directive, compile } from "../mvc/directive.js";

let uid = 0;

directive('x-repeat', 80, el => el.hasAttribute('x-repeat'),
  /**
   * Repeat a template a fixed number of times (`x-repeat="3"`).
   * The element is replaced by a comment placeholder; each iteration gets a
   * clone compiled against the same scope.
   * @param {Element} el - Element carrying the `x-repeat` attribute (the count).
   * @param {Object} $scope - Scope shared by the template and its clones.
   */
  (el, $scope) => {
    const expr = el.getAttribute('x-repeat');
    if (!el._template) {
      el._template = el.cloneNode(true);
      el._template.removeAttribute('x-repeat');
      el._marker = 'data-x-repeat-' + ++uid; // unique so sibling x-repeat's don't remove each other's clones
      el._placeholder = document.createComment('x-repeat');
      el.parentNode.insertBefore(el._placeholder, el);
      el.remove();
    }
    const parent = el._placeholder.parentNode;
    /**
     * Remove the current clones and re-render `times` copies of the template.
     */
    function render() {
      parent.querySelectorAll('[' + el._marker + ']').forEach(n => n.remove());
      const times = safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)) || 0;
      let anchor = el._placeholder;
      for (let i = 0; i < times; i++) {
        const clone = el._template.cloneNode(true);
        clone.setAttribute(el._marker, '');
        // Insert before compiling: compile() only walks children of connected nodes
        parent.insertBefore(clone, anchor.nextSibling);
        anchor = clone;
        compile(clone, $scope);
      }
    }
    $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), render);
    render();
  });
