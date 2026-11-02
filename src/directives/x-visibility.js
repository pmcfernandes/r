import { safeEval } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

directive('x-show', 90, el => el.hasAttribute('x-show'), (el, $scope) => {
  const expr = el.getAttribute('x-show');
  const update = val => { el.style.display = val ? '' : 'none'; };
  $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), update);
  update(true);
});

directive('x-hide', 90, el => el.hasAttribute('x-hide'), (el, $scope) => {
  const expr = el.getAttribute('x-hide');
  const update = val => { el.style.display = val ? 'none' : ''; };
  $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), update);
  update(false);
});
