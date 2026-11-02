"use strict";

const providers = new Map();
const controllers = new Map();

function provide(name, value) {
  providers.set(name, value);
}

function controller(name, deps, factory) {
  controllers.set(name, { deps, factory });
}

function resolve(deps, locals = {}) {
  return deps.map(d => {
    if (d in locals) return locals[d];
    if (providers.has(d)) return providers.get(d);
    throw new Error('Unknown dependency: ' + d);
  });
}

export { provide, controller, resolve, controllers };
