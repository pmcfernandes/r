import { safeEval } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

directive('x-on', 90, el => Array.from(el.attributes).some(a => a.name.startsWith('x-on:')),
  /**
   * Bind an event listener for every `x-on:<event>` attribute on the element.
   * The attribute body runs as statements with `with(scope)` in scope and `$event`
   * bound to the native event; a digest runs afterwards.
   * @param {Element} el - Element carrying one or more `x-on:*` attributes.
   * @param {Object} $scope - Scope in which the handler statements execute.
   */
  (el, $scope) => {
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
