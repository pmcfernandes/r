"use strict";

/**
 * Create a reactive scope: a Proxy over `initial` plus watcher/digest helpers.
 * Assigning any property schedules a throttled digest automatically.
 * @param {Object} [initial] - Backing object; usually `Object.create(parentScope)` for child scopes.
 * @returns {Object} The scope proxy exposing `$watch`, `$eval` and `$digest`.
 */
function createScope(initial = {}) {
  const watchers = [];
  let phase = null;

  const scope = new Proxy(initial, {
    set(target, key, val) {
      target[key] = val;
      if (phase !== '$digest') digest();
      return true;
    }
  });

  /**
   * Register a watcher; its listener runs on every digest while the value changes.
   * @param {Function} exprFn - `(scope) => value`; evaluation errors count as `undefined`.
   * @param {Function} [listener] - `(value, lastValue, scope) => void`, invoked on change and on the first run.
   */
  function $watch(exprFn, listener = () => { }) {
    watchers.push({ exprFn, listener, last: undefined, firstRun: true });
  }

  /**
   * Evaluate an expression function against a scope.
   * The caller is used as `this`, so derived scopes (e.g. x-for locals) evaluate against themselves.
   * @param {Function} exprFn - `(scope) => value`.
   * @returns {*} Expression result.
   */
  function $eval(exprFn) { return exprFn(this ?? scope); }

  /**
   * Run all watchers until no value changes (at most 10 iterations).
   * The digest phase is cleared even if a listener or expression throws,
   * otherwise the scope would stop reacting to later assignments.
   */
  function $digest() {
    phase = '$digest';
    try {
      let dirty, ttl = 10;
      do {
        dirty = false;
        for (const w of watchers) {
          const value = safeEval(() => w.exprFn(scope));
          if (w.firstRun || !isEqual(value, w.last)) {
            w.listener(value, w.last, scope);
            w.last = clone(value);
            w.firstRun = false;
            dirty = true;
          }
        }
        if (dirty && !(ttl--)) {
          console.warn('Max digest iterations reached');
          break;
        }
      } while (dirty);
    } finally {
      // Always leave the digest phase, otherwise a throwing listener/expression
      // would freeze the scope forever (the proxy's set trap skips digests)
      phase = null;
    }
  }

  // helpers
  const digest = microtaskThrottle($digest);
  return Object.assign(scope, { $watch, $eval, $digest });
}

/**
 * Coalesce rapid calls into a single invocation scheduled on the next microtask.
 * @param {Function} fn - Function to throttle.
 * @returns {Function} Throttled wrapper (`fn` runs at most once per microtask turn).
 */
function microtaskThrottle(fn) {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; fn(); });
  };
}

/**
 * Compare two values via JSON serialization (structural equality).
 * @param {*} a - First value.
 * @param {*} b - Second value.
 * @returns {boolean} True when both serialize identically; falls back to `===`
 * when serialization fails (e.g. circular structures).
 */
function isEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b; // circular structures cannot be stringified
  }
}

/**
 * Structured clone through JSON.
 * @param {*} v - Value to clone.
 * @returns {*} A detached deep copy, or the original value when it is not serializable.
 */
function clone(v) {
  try { return JSON.parse(JSON.stringify(v)); } catch { return v; }
}

/**
 * Run a function, swallowing errors.
 * @param {Function} fn - Function to invoke.
 * @returns {*} The function's result, or `undefined` if it threw.
 */
function safeEval(fn) {
  try { return fn(); } catch { return undefined; }
}

export { createScope, safeEval };
