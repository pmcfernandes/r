import { safeEval } from "../mvc/scope.js";
import { directive, compile } from "../mvc/directive.js";

directive('x-repeat', 80, el => el.hasAttribute('x-repeat'), (el, $scope) => {
  const expr = el.getAttribute('x-repeat');
  if (!el._template) {
    el._template = el.cloneNode(true);
    el._template.removeAttribute('x-repeat');
    el.style.display = 'none';
    el.parentNode.insertBefore(el._template, el);
    el.remove();
  }
  const parent = el._template.parentNode;
  function render() {
    parent.querySelectorAll('[data-x-repeat]').forEach(n => n.remove());
    const times = safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)) || 0;
    for (let i = 0; i < times; i++) {
      const clone = el._template.cloneNode(true);
      clone.removeAttribute('style');
      clone.setAttribute('data-x-repeat', '');
      compile(clone, $scope);
      parent.appendChild(clone);
    }
  }
  $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + expr + '}')($scope)), render);
  render();
});
