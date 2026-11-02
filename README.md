# R (Javascript MVC)

R is a tiny, zero-dependency front-end MVC framework for the browser, wrapped in a Vite project for development and building. It combines three layers in a little over a thousand lines of plain JavaScript:

1. **A jQuery-style DOM helper (`$`)** for selecting elements, manipulating the DOM, binding events and making AJAX requests.
2. **An AngularJS-style reactive core** — scopes (`$watch` / `$digest`), a priority-based directive compiler, and dependency injection (`provide` / `controller`).
3. **A set of built-in directives** (`x-model`, `x-for`, `x-if`, `x-on:*`, …) that let you build interactive UIs declaratively in HTML, without writing any glue code.

The whole framework auto-boots: when the page loads it fetches any `x-include-html` fragments, compiles the document against a root scope, and runs the first digest cycle.

## Main features

- **Two-way data binding** — `x-model` keeps form controls (`input`, `textarea`, `select`, checkboxes, numbers) in sync with scope properties in both directions.
- **Reactive scopes** — a `Proxy` over your data: any property assignment automatically schedules a throttled digest (coalesced to one microtask), so watchers and the UI update themselves.
- **Declarative directives** — templating, conditionals, loops and events written directly in HTML:
  - `x-text` / `x-html` — bind text or raw HTML
  - `x-show` / `x-hide` — toggle visibility
  - `x-if` — conditionally insert/remove a subtree
  - `x-for` — repeat a template per array item (with `$index`)
  - `x-repeat` — repeat a template a fixed number of times
  - `x-on:event` — bind event handlers (`$event` available)
  - `x-controller` — create a child scope and instantiate a controller
  - `x-include-html` — fetch and inline HTML fragments (including nested ones) before bootstrap
- **Dependency injection** — register services with `$.provide()` and inject them into controllers by name; `$element` and `$scope` are built-in injectables.
- **Directive compiler** — a breadth-first DOM walk with directive priorities; a directive can return a child scope that applies to the rest of its subtree.
- **jQuery-like DOM helper** — chainable collection API (`find`, `append`, `addClass`, `css`, `on`, `show`/`hide`, …), plus `$.ajax`, `$.includeHTML`, `$.createElement`, `$.ready` and a plugin system (`$.fn.plugin`).
- **Slideshow widget** — automatic initialisation of `.slideshow` components with prev/next controls, indicators and configurable autoplay (`data-interval`).
- **Vite tooling** — fast dev server with HMR, and a production build that emits a single self-contained IIFE bundle (`dist/r.all.js`).

## Principal functions

### Global `$` — DOM helper and framework entry point

| Function | Description |
| --- | --- |
| `$(selector, context?)` | Select elements (CSS selector, element, NodeList, array, `window`/`document`) and wrap them in a chainable collection. |
| `$.extend(target, ...sources)` | Shallow-merge source objects into a target object. |
| `$.ajax(options)` | XHR request with `method`, `url`, `data`, `headers`, `success`, `error` options. |
| `$.includeHTML(url, target, callback)` | Fetch a URL and inject the response HTML into a target element. |
| `$.createElement(tag, attrs?, children?)` | Create a DOM element from a tag name, attributes and children. |
| `$.ready(fn)` | Run a function once the DOM is ready. |
| `$.provide(name, value)` | Register a value for dependency injection. |
| `$.controller(name, deps, factory)` | Register a controller referenced by `x-controller="name"`. |
| `$.bootstrap(root?)` | Compile a subtree against a fresh root scope and run the first digest. |
| `$.fn` / `$.fn.plugin(name, fn)` | Collection prototype / register a chainable plugin method. |

Collection methods (chainable): `each`, `on`, `off`, `addClass`, `removeClass`, `toggleClass`, `css`, `first`, `last`, `attr`, `removeAttr`, `html`, `text`, `show`, `hide`, `toggle`, `parent`, `children`, `find`, `append`, `prepend`, `before`, `after`.

### Scope API — `createScope(initial?)`

| Function | Description |
| --- | --- |
| `$watch(exprFn, listener?)` | Register a watcher; its listener runs on every digest while the value changes (and on the first run). |
| `$eval(exprFn)` | Evaluate an expression function against the scope. |
| `$digest()` | Run all watchers until no value changes (max 10 iterations). Any scope assignment schedules this automatically (microtask-throttled). |

Scopes are `Proxy` objects; child scopes created by `x-controller` or `x-for` inherit through the prototype chain.

### Dependency injection — `mvc/di.js`

| Function | Description |
| --- | --- |
| `provide(name, value)` | Register a value under a name (also exposed as `$.provide`). |
| `controller(name, deps, factory)` | Register a controller: `deps` is a list of provider names injected into `factory` in order. |
| `resolve(deps, locals?)` | Resolve dependency names to values; `locals` (e.g. `$element`, `$scope`) take precedence. |

### Directive system — `mvc/directive.js`

| Function | Description |
| --- | --- |
| `directive(name, priority, match, link)` | Register a directive. `match(el)` decides whether it applies; `link(el, scope)` runs it and may return a child scope for the subtree. |
| `compile(root, scope)` | Walk the DOM breadth-first and link every matching directive in priority order. |

Built-in priorities: `x-controller` (1000) → `x-text`/`x-html` (100) → `x-model` (95) → `x-on`/`x-show`/`x-hide` (90) → `x-if` (85) → `x-for`/`x-repeat` (80).

### Includes — `directives/x-include-html.js`

| Function | Description |
| --- | --- |
| `includeHTML(root?)` | Fetch and inline every `[x-include-html]` fragment below `root`, recursively; resolves when all fragments are in the DOM. |
| `includesReady` | Promise used by bootstrap so fragments are compiled instead of racing the fetches. |

## Usage example

```html
<div x-controller="TodoCtrl">
  <input x-model="newTodo" placeholder="What needs to be done?" />
  <button x-on:click="add()">Add</button>

  <ul>
    <li x-for="todo in todos" x-text="todo"></li>
  </ul>

  <p x-show="todos.length" x-text="'Total: ' + todos.length"></p>
</div>
```

```js
$.controller('TodoCtrl', ['$scope'], ($scope) => {
  $scope.newTodo = '';
  $scope.todos = [];

  $scope.add = () => {
    if ($scope.newTodo.trim()) {
      $scope.todos.push($scope.newTodo.trim());
      $scope.newTodo = '';
    }
  };
});
```

## Getting started

Basic commands (PowerShell):

```powershell
# install dev deps
npm install

# start dev server (open http://localhost:5173)
npm run dev

# build production bundle into dist/
npm run build

# preview the production build
npm run preview
```

## Project structure

```
index.html              App page (loads src/entry-all.js)
src/
  entry-all.js          Entry point that imports every module
  base.js               $ DOM helper and collection API
  bootstrap.js          Auto-boot: compile document + first digest
  slideshow.js          .slideshow widget
  mvc/
    scope.js            Reactive scope ($watch / $digest)
    di.js               provide / controller / resolve
    directive.js        directive registry + compile()
  directives/           Built-in x-* directives (registered via index.js)
vite.config.js          Vite config → single IIFE bundle (dist/r.all.js)
```

The entry point is `src/entry-all.js`, which bootstraps the app through `src/bootstrap.js`.
