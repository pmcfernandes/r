import { safeEval } from "../mvc/scope.js";
import { directive } from "../mvc/directive.js";

directive('x-model', 95, el => el.hasAttribute('x-model') && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName), (el, $scope) => {
  const path = el.getAttribute('x-model');
  function get() { return safeEval(() => new Function('s', 'with(s){return ' + path + '}')($scope)); }
  function set(v) { safeEval(() => new Function('s', 'v', 'with(s){' + path + '= v}')($scope, v)); $scope.$digest(); }

  // view -> model
  const event = el.tagName === 'SELECT' ? 'change' : 'input';
  el.addEventListener(event, () => {
    const v = el.type === 'checkbox' ? el.checked :
      el.type === 'number' ? (el.value === '' ? null : Number(el.value)) :
        el.value;
    set(v);
  });

  // model -> view
  $scope.$watch(get, val => {
    if (el.type === 'checkbox') el.checked = !!val;
    else if (document.activeElement !== el) el.value = val ?? '';
  });
});
