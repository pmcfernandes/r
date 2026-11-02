"use strict";

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

  function $watch(exprFn, listener = () => { }) {
    watchers.push({ exprFn, listener, last: undefined, firstRun: true });
  }

  function $eval(exprFn) { return exprFn(scope); }

  function $digest() {
    phase = '$digest';
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
    phase = null;
  }

  // helpers
  const digest = microtaskThrottle($digest);
  return Object.assign(scope, { $watch, $eval, $digest });
}

function microtaskThrottle(fn) {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; fn(); });
  };
}
function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function clone(v) {
  try { return JSON.parse(JSON.stringify(v)); } catch { return v; }
}
function safeEval(fn) {
  try { return fn(); } catch { return undefined; }
}

export { createScope, safeEval };
