import { safeEval } from "../mvc/scope.js";
import { directive, compile } from "../mvc/directive.js";

directive('x-if', 85, el => el.hasAttribute('x-if'), (el, $scope) => {
  const expr = el.getAttribute('x-if');
  if (!el._template) {
    el._template = el.cloneNode(true);
    el._template.removeAttribute('x-if');
    el._placeholder = document.createComment('x-if placeholder');
    el.parentNode.insertBefore(el._placeholder, el);
    el.remove();
  }
  const parent = el._placeholder.parentNode;
  function render() {
    const cond = safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope));
    const exists = !!el._instance;
    if (cond && !exists) {
      const clone = el._template.cloneNode(true);
      el._instance = clone;
      compile(clone, $scope);
      parent.insertBefore(clone, el._placeholder.nextSibling);
    } else if (!cond && exists) {
      el._instance.remove();
      el._instance = null;
    }
  }
  $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), render);
  render();
});
