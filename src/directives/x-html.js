import { safeEval } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

directive('x-html', 100, el => el.hasAttribute('x-html'), 
  /**
   * Write the expression result into the element's `innerHTML`.
   * @param {Element} el - Element carrying the `x-html` attribute.
   * @param {Object} $scope - Scope the expression is evaluated against.
   */
  (el, $scope) => {
    const expr = el.getAttribute('x-html');
    const render = () => el.innerHTML = safeEval(() => $scope.$eval(s => new Function('s', 'with(s){return ' + expr + '}')(s))) ?? '';
    $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), render);
    render();
  });
