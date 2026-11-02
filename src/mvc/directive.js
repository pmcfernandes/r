"use strict";

const directives = [];

/**
 * Register a directive.
 * @param {string} name - Unique directive name (used for debugging/ordering).
 * @param {number} priority - Higher values run first when several directives match one element.
 * @param {Function} match - `(el) => boolean` deciding whether the directive applies to an element.
 * @param {Function} link - `(el, scope) => any`. May return a child scope, which `compile`
 * then uses for the remaining directives on that element and for its children (used by x-controller).
 */
function directive(name, priority, match, link) {
  directives.push({ name, priority, match, link });
  directives.sort((a, b) => b.priority - a.priority);
}

/**
 * Walk the DOM breadth-first and link every matching directive.
 * The walk starts at `root` (an element, the Document, or a fragment) and carries each
 * node's scope, so a scope returned by one link applies to the rest of that subtree.
 * @param {Element|Document|DocumentFragment} root - Where to start linking.
 * @param {Object} scope - Scope handed to the first directives; replaced when a link returns a new one.
 */
function compile(root, scope) {
  // BFS walk to maintain DOM order; each entry carries its scope so that a
  // directive (x-controller) can introduce a child scope for its subtree
  const queue = [[root, scope]];
  while (queue.length) {
    const [node, nodeScope] = queue.shift();
    if (node.nodeType !== 1) {
      // Non-element roots (Document, fragment) have no directives of their own
      if (node.children) {
        queue.push(...[...node.children].map(child => [child, nodeScope]));
      }
      continue;
    }
    let currentScope = nodeScope;
    // Run directives in priority order; a link may return a replacement scope
    for (const d of directives) {
      if (!d.match(node)) continue;
      const replacement = d.link(node, currentScope);
      if (replacement) currentScope = replacement;
    }
    // Enqueue children (unless removed)
    if (node.isConnected) {
      queue.push(...[...node.children].map(child => [child, currentScope]));
    }
  }
}

export { directive, compile };
