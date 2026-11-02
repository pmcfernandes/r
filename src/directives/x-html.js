import { safeEval } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

directive('x-html', 100, el => el.hasAttribute('x-html'), (el, $scope) => {
  const expr = el.getAttribute('x-html');
  const render = () => el.innerHTML = safeEval(() => $scope.$eval(s => new Function('s', 'with(s){return ' + expr + '}')(s))) ?? '';
  $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), render);
  render();
});
