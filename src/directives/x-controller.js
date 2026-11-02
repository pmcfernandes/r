import { provide, resolve, controllers } from "../mvc/di.js";
import { createScope } from "../mvc/scope.js";
import { directive, compile } from "../mvc/directive.js";

// x-controller (priority high to setup scope early)
directive('x-controller', 1000, el => el.hasAttribute('x-controller'), (el, parentScope) => {
  const name = el.getAttribute('x-controller');
  const def = controllers.get(name);
  if (!def) throw new Error('Controller not found: ' + name);

  // child scope that inherits via prototype
  const childScope = createScope(Object.create(parentScope || {}));

  // injectables
  provide('$element', el);
  provide('$scope', childScope);
  const args = resolve(def.deps, { $element: el, $scope: childScope });
  def.factory(...args);

  // compile inside this controller boundary
  compile(el, childScope);
  childScope.$digest();
});
