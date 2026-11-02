import { safeEval } from "../mvc/scope.js";
import { directive, compile } from "../mvc/directive.js";

directive('x-for', 80, el => el.hasAttribute('x-for'), (el, $scope) => {
  const expr = el.getAttribute('x-for'); // e.g. "item in items"
  const [itemName, arrExpr] = expr.split(' in ').map(s => s.trim());
  if (!el._template) {
    el._template = el.cloneNode(true);
    el._template.removeAttribute('x-for');
    el.style.display = 'none';
    el.parentNode.insertBefore(el._template, el);
    el.remove();
  }
  const parent = el._template.parentNode;
  function render() {
    parent.querySelectorAll('[data-x-for]').forEach(n => n.remove());
    const arr = safeEval(() => new Function('s', 'with(s){return ' + arrExpr + '}')($scope)) || [];
    arr.forEach((val, i) => {
      const clone = el._template.cloneNode(true);
      clone.removeAttribute('style');
      clone.setAttribute('data-x-for', '');
      const localScope = Object.create($scope);
      localScope[itemName] = val;
      localScope.$index = i;
      compile(clone, localScope);
      parent.appendChild(clone);
    });
  }
  $scope.$watch(() => safeEval(() => new Function('s', 'with(s){return ' + arrExpr + '}')($scope)), render);
  render();
});
