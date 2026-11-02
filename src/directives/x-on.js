import { safeEval } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

directive('x-on', 90, el => Array.from(el.attributes).some(a => a.name.startsWith('x-on:')), (el, $scope) => {
  for (const a of el.attributes) {
    if (!a.name.startsWith('x-on:')) continue;
    const evt = a.name.slice(5);
    const expr = a.value;
    el.addEventListener(evt, e => {
      safeEval(() => new Function('s', '$event', 'with(s){' + expr + '}')($scope, e));
      $scope.$digest();
    });
  }
});
