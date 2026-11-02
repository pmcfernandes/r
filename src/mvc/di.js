"use strict";

const providers = new Map();
const controllers = new Map();

/**
 * Register a value under a name for dependency injection.
 * @param {string} name - Provider name as used in controller dependency lists.
 * @param {*} value - Value handed to dependents as-is.
 */
function provide(name, value) {
  providers.set(name, value);
}

/**
 * Register a controller definition.
 * @param {string} name - Name referenced by `x-controller="name"`.
 * @param {string[]} deps - Provider names injected into the factory, in order.
 * @param {Function} factory - Called with the resolved dependencies; return value is ignored.
 */
function controller(name, deps, factory) {
  controllers.set(name, { deps, factory });
}

/**
 * Resolve dependency names to their values.
 * @param {string[]} deps - Names to resolve.
 * @param {Object<string, *>} [locals] - Values that take precedence over registered providers.
 * @returns {*} Resolved values, in the same order as `deps`.
 * @throws {Error} When a name is neither in `locals` nor registered as a provider.
 */
function resolve(deps, locals = {}) {
  return deps.map(d => {
    if (d in locals) return locals[d];
    if (providers.has(d)) return providers.get(d);
    throw new Error('Unknown dependency: ' + d);
  });
}

export { provide, controller, resolve, controllers };
