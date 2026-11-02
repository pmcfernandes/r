"use strict";

const directives = [];

function directive(name, priority, match, link) {
  directives.push({ name, priority, match, link });
  directives.sort((a, b) => b.priority - a.priority);
}

function compile(root, scope) {
  // BFS walk to maintain DOM order
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node.nodeType !== 1) continue; // Element only
    // Run directives in priority order
    for (const d of directives) {
      if (d.match(node)) d.link(node, scope);
    }
    // Enqueue children (unless removed)
    if (node.isConnected) queue.push(...node.children);
  }
}

export { directive, compile };
