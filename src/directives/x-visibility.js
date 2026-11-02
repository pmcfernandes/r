import { safeEval } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

directive('x-show', 90, el => el.hasAttribute('x-show'),
  /**
   * Toggle the element's inline `display` based on a truthy expression.
   * @param {Element} el - Element carrying the `x-show` attribute.
   * @param {Object} $scope - Scope the expression is evaluated against.
   */
  (el, $scope) => {
    const expr = el.getAttribute('x-show');
    const update = val => { el.style.display = val ? '' : 'none'; };
    $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), update);
    update(true);
  });

directive('x-hide', 90, el => el.hasAttribute('x-hide'),
  /**
   * Toggle the element's inline `display` based on a truthy expression (inverse of x-show).
   * @param {Element} el - Element carrying the `x-hide` attribute.
   * @param {Object} $scope - Scope the expression is evaluated against.
   */
  (el, $scope) => {
    const expr = el.getAttribute('x-hide');
    const update = val => { el.style.display = val ? 'none' : ''; };
    $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), update);
    update(false);
  });
