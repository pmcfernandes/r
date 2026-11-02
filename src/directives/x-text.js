import { safeEval } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

directive('x-text', 100, el => el.hasAttribute('x-text'), 
  /**
   * Write the expression result into the element's `textContent`.
   * @param {Element} el - Element carrying the `x-text` attribute.
   * @param {Object} $scope - Scope the expression is evaluated against.
   */
  (el, $scope) => {
    const expr = el.getAttribute('x-text');
    const render = () => el.textContent = safeEval(() => $scope.$eval(s => new Function('s', 'with(s){return ' + expr + '}')(s))) ?? '';
    $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), render);
    render();
  });
