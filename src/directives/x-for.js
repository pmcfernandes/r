import { safeEval } from "../mvc/scope.js";
import { directive, compile } from "../mvc/directive.js";

let uid = 0;

directive('x-for', 80, el => el.hasAttribute('x-for'),
  /**
   * Repeat a template once per array item (`x-for="item in items"`).
   * The element is replaced by a comment placeholder; each item gets a clone
   * compiled against a local scope exposing the item and `$index`.
   * @param {Element} el - Element carrying the `x-for` attribute.
   * @param {Object} $scope - Parent scope; the array expression is evaluated against it.
   */
  (el, $scope) => {
    const expr = el.getAttribute('x-for'); // e.g. "item in items"
    const [itemName, arrExpr] = expr.split(' in ').map(s => s.trim());
    if (!el._template) {
      el._template = el.cloneNode(true);
      el._template.removeAttribute('x-for');
      el._marker = 'data-x-for-' + ++uid; // unique so sibling x-for's don't remove each other's clones
      el._placeholder = document.createComment('x-for');
      el.parentNode.insertBefore(el._placeholder, el);
      el.remove();
    }
    const parent = el._placeholder.parentNode;
    /**
     * Remove the current clones and re-render one clone per array item.
     */
    function render() {
      parent.querySelectorAll('[' + el._marker + ']').forEach(n => n.remove());
      const arr = safeEval(() => new Function('s', 'with(s){return ' + arrExpr + '}')($scope)) || [];
      let anchor = el._placeholder;
      (Array.isArray(arr) ? arr : []).forEach((val, i) => {
        const clone = el._template.cloneNode(true);
        clone.setAttribute(el._marker, '');
        const localScope = Object.create($scope);
        localScope[itemName] = val;
        localScope.$index = i;
        // Insert before compiling: compile() only walks children of connected nodes
        parent.insertBefore(clone, anchor.nextSibling);
        anchor = clone;
        compile(clone, localScope);
      });
    }
    $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + arrExpr + '}')($scope)), render);
    render();
  });
