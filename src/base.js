"use strict";

// Utility functions
; (() => {
  /** @param {*} v @returns {boolean} True when v is a function. */
  const isFn = (v) => typeof v === 'function';
  /** @param {*} v @returns {boolean} True when v is a string. */
  const isStr = (v) => typeof v === 'string';
  /** @param {*} v @returns {boolean} True when v is a non-null, non-array object. */
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  /**
   * Normalise a value to an array.
   * @param {*} v - Value to wrap.
   * @returns {Array} `v` when it is an array, `[]` for null/undefined, otherwise `[v]`.
   */
  const toArray = (v) =>
    v == null ? [] : Array.isArray(v) ? v : [v];

  /**
   * Core collection constructor wrapping a list of elements.
   * Instances are array-like (numeric indices + `length`) and chainable.
   * @param {Element[]} elements - Elements to wrap.
   */
  function r(elements) {
    this.length = 0;
    elements.forEach((el, i) => {
      this[i] = el;
      this.length++;
    });
  }

  /**
   * Invoke a callback for each element in the collection.
   * @param {Function} fn - `(index, element) => void`, called with the element as `this`.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.each = function (fn) {
    for (let i = 0; i < this.length; i++) {
      fn.call(this[i], i, this[i]);
    }
    return this;
  }

  /**
   * Attach an event listener to every element.
   * @param {string} event - Event type (e.g. `'click'`).
   * @param {Function} handler - Listener function.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.on = function (event, handler) {
    return this.each(el => el.addEventListener(event, handler));
  }

  /**
   * Detach an event listener from every element.
   * @param {string} event - Event type (e.g. `'click'`).
   * @param {Function} handler - The same function reference passed to `on`.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.off = function (event, handler) {
    return this.each(el => el.removeEventListener(event, handler));
  }

  /**
   * Add a class to every element.
   * @param {string} className - Class name to add.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.addClass = function (className) {
    return this.each(el => el.classList.add(className));
  }

  /**
   * Remove a class from every element.
   * @param {string} className - Class name to remove.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.removeClass = function (className) {
    return this.each(el => el.classList.remove(className));
  }

  /**
   * Toggle a class on every element.
   * @param {string} className - Class name to toggle.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.toggleClass = function (className) {
    return this.each(el => el.classList.toggle(className));
  }

  /**
   * Get a computed style value, or set an inline style on every element.
   * @param {string} prop - CSS property name in camelCase (e.g. `'backgroundColor'`).
   * @param {string} [value] - Inline value to set; omit to read the computed value.
   * @returns {string|undefined|r} Computed value of the first element when reading,
   * otherwise the collection (for chaining).
   */
  r.prototype.css = function (prop, value) {
    if (value == undefined) {
      return this.length > 0 ? getComputedStyle(this[0])[prop] : undefined;
    }

    return this.each(el => el.style[prop] = value);
  }

  /**
   * Reduce the collection to its first element.
   * @returns {r} A new collection with at most one element.
   */
  r.prototype.first = function () {
    return this.length > 0 ? new r([this[0]]) : new r([]);
  }

  /**
   * Reduce the collection to its last element.
   * @returns {r} A new collection with at most one element.
   */
  r.prototype.last = function () {
    return this.length > 0 ? new r([this[this.length - 1]]) : new r([]);
  }

  /**
   * Read an attribute from the first element, or set it on every element.
   * @param {string} name - Attribute name.
   * @param {string} [value] - Attribute value to set; omit to read.
   * @returns {string|null|undefined|r} Attribute value of the first element when reading,
   * otherwise the collection (for chaining).
   */
  r.prototype.attr = function (name, value) {
    if (value == undefined) return this[0]?.getAttribute(name);
    return this.each(el => el.setAttribute(name, value));
  }

  /**
   * Remove an attribute from every element.
   * @param {string} name - Attribute name.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.removeAttr = function (name) {
    return this.each(el => el.removeAttribute(name));
  }

  /**
   * Read the HTML of the first element, or replace the HTML of every element.
   * @param {string} [html] - Markup to set; omit to read.
   * @returns {string|undefined|r} `innerHTML` of the first element when reading,
   * otherwise the collection (for chaining).
   */
  r.prototype.html = function (html) {
    if (html == undefined) return this[0]?.innerHTML;
    return this.each(el => el.innerHTML = html);
  }

  /**
   * Read the text of the first element, or replace the text of every element.
   * @param {string} [text] - Text to set; omit to read.
   * @returns {string|undefined|r} `textContent` of the first element when reading,
   * otherwise the collection (for chaining).
   */
  r.prototype.text = function (text) {
    if (text == undefined) return this[0]?.textContent;
    return this.each(el => el.textContent = text);
  }

  /**
   * Show hidden elements by clearing (or overriding) their `display` style.
   * @param {string} [display='block'] - Display value used when the element is hidden by CSS.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.show = function (display = 'block') {
    return this.each(el => {
      if (el.style.display === 'none') el.style.display = '';
      if (getComputedStyle(el).display === 'none') el.style.display = display;
    });
  }

  /**
   * Hide every element by setting `display: none`.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.hide = function () {
    return this.each(el => el.style.display = 'none');
  }

  /**
   * Toggle every element's visibility.
   * @param {string} [display='block'] - Display value used when showing.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.toggle = function (display = 'block') {
    return this.each(el => {
      if (getComputedStyle(el).display === 'none') {
        el.style.display = display;
      } else {
        el.style.display = 'none';
      }
    });
  }

  /**
   * Collect the distinct parents of all elements.
   * @returns {r} New collection of parent elements (document order, no duplicates).
   */
  r.prototype.parent = function () {
    const parents = [];
    this.each(el => {
      if (el.parentElement && !parents.includes(el.parentElement)) {
        parents.push(el.parentElement);
      } // Ignore if no parent or already added
    });
    return new r(parents);
  }

  /**
   * Collect the distinct element children of all elements.
   * @returns {r} New collection of child elements (no duplicates).
   */
  r.prototype.children = function () {
    let children = [];
    this.each(el => {
      children = children.concat(toArray(el.children));
    });
    children = [...new Set(children)]; // Remove duplicates
    return new r(children);
  }

  /**
   * Find descendants of all elements matching a CSS selector.
   * @param {string} selector - CSS selector.
   * @returns {r} New collection of matching descendants (no duplicates).
   */
  r.prototype.find = function (selector) {
    let found = [];
    this.each(el => {
      found = found.concat(toArray(el.querySelectorAll(selector)));
    });
    found = [...new Set(found)]; // Remove duplicates
    return new r(found);
  }

  /**
   * Append content to the end of every element.
   * Elements are cloned per target so multiple targets each receive a copy.
   * @param {string|Element|r|Array} content - HTML string, element, collection or mixed array of those.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.append = function (content) {
    if (isStr(content)) {
      return this.each(el => el.insertAdjacentHTML('beforeend', content));
    } else if (content instanceof Element) {
      return this.each(el => el.appendChild(content.cloneNode(true)));
    } else if (content instanceof r) {
      return this.each(el => {
        content.each(child => el.appendChild(child.cloneNode(true)));
      });
    } else if (Array.isArray(content)) {
      return this.each(el => {
        content.forEach(child => {
          if (child instanceof Element) {
            el.appendChild(child.cloneNode(true));
          } else if (isStr(child)) {
            el.insertAdjacentHTML('beforeend', child);
          } else if (child instanceof r) {
            child.each(grandChild => el.appendChild(grandChild.cloneNode(true)));
          } // Ignore other types
        });
      });
    } // Ignore other types
    return this;
  }

  /**
   * Prepend content to the start of every element.
   * Elements are cloned per target so multiple targets each receive a copy.
   * @param {string|Element|r|Array} content - HTML string, element, collection or mixed array of those.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.prepend = function (content) {
    if (isStr(content)) {
      return this.each(el => el.insertAdjacentHTML('afterbegin', content));
    } else if (content instanceof Element) {
      return this.each(el => el.insertBefore(content.cloneNode(true), el.firstChild));
    } else if (content instanceof r) {
      return this.each(el => {
        content.each(child => el.insertBefore(child.cloneNode(true), el.firstChild));
      });
    } else if (Array.isArray(content)) {
      return this.each(el => {
        content.slice().reverse().forEach(child => {
          if (child instanceof Element) {
            el.insertBefore(child.cloneNode(true), el.firstChild);
          } else if (isStr(child)) {
            el.insertAdjacentHTML('afterbegin', child);
          } else if (child instanceof r) {
            child.each(grandChild => el.insertBefore(grandChild.cloneNode(true), el.firstChild));
          } // Ignore other types
        });
      } );
    } // Ignore other types
    return this;
  }

  /**
   * Insert content immediately before each element.
   * Elements are cloned per target so multiple targets each receive a copy.
   * @param {string|Element|r|Array} content - HTML string, element, collection or mixed array of those.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.before = function (content) {
    if (isStr(content)) {
      return this.each(el => el.insertAdjacentHTML('beforebegin', content));
    } else if (content instanceof Element) {
      return this.each(el => el.parentElement.insertBefore(content.cloneNode(true), el));
    } else if (content instanceof r) {
      return this.each(el => {
        content.each(child => el.parentElement.insertBefore(child.cloneNode(true), el));
      });
    } else if (Array.isArray(content)) {
      return this.each(el => {
        content.forEach(child => {
          if (child instanceof Element) {
            el.parentElement.insertBefore(child.cloneNode(true), el);
          } else if (isStr(child)) {
            el.insertAdjacentHTML('beforebegin', child);
          } else if (child instanceof r) {
            child.each(grandChild => el.parentElement.insertBefore(grandChild.cloneNode(true), el));
          } // Ignore other types
        } );
      });
    }  // Ignore other types
    return this;
  }

  /**
   * Insert content immediately after each element.
   * Elements are cloned per target so multiple targets each receive a copy.
   * @param {string|Element|r|Array} content - HTML string, element, collection or mixed array of those.
   * @returns {r} The same collection (for chaining).
   */
  r.prototype.after = function (content) {
    if (isStr(content)) {
      return this.each(el => el.insertAdjacentHTML('afterend', content));
    } else if (content instanceof Element) {
      return this.each(el => el.parentElement.insertBefore(content.cloneNode(true), el.nextSibling));
    } else if (content instanceof r) {
      return this.each(el => {
        let next = el.nextSibling;
        content.each(child => {
          el.parentElement.insertBefore(child.cloneNode(true), next);
          next = child; // Update next to the newly inserted child
        });
      });
    } else if (Array.isArray(content)) {
      return this.each(el => {
        let next = el.nextSibling;
        content.forEach(child => {
          if (child instanceof Element) {
            el.parentElement.insertBefore(child.cloneNode(true), next);
            next = child; // Update next to the newly inserted child
          } else if (isStr(child)) {
            el.insertAdjacentHTML('afterend', child);
            next = el.nextSibling; // Update next to the newly inserted HTML
          } else if (child instanceof r) {
            child.each(grandChild => {
              el.parentElement.insertBefore(grandChild.cloneNode(true), next);
              next = grandChild; // Update next to the newly inserted grandChild
            });
          } // Ignore other types
        });
      });
    }  // Ignore other types
    return this;
  }

  /**
   * Main entry point: select elements and wrap them in a collection.
   * @param {string|Element|NodeList|Array|Window|Document} selector - CSS selector or host object.
   * @param {Element|Document} [context] - Root to query against (defaults to `document`).
   * @returns {r} Collection of matched elements (empty when nothing matches).
   */
  function $(selector, context) {
    context = context || document;

    if (selector instanceof Element || selector === window || selector === document) {
      return new r([selector]);
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      return new r(toArray(selector));
    } else {
      return new r(toArray(context.querySelectorAll(selector)) || []);
    }
  }

  /**
   * Shallow-merge source objects into a target object.
   * @param {Object} target - Object to merge into; non-objects are replaced by `{}`.
   * @param {...Object} sources - Objects whose own enumerable keys are copied.
   * @returns {Object} The mutated target.
   */
  $.extend = function (target, ...sources) {
    if (!isObj(target)) target = {};
    sources.forEach(source => {
      if (isObj(source)) {
        Object.keys(source).forEach(key => {
          target[key] = source[key];
        });
      }
    });
    return target;
  }

  /**
   * Fetch a URL over HTTP and inject the response HTML into a target element.
   * @param {string} url - Resource to fetch.
   * @param {string} targetSelector - CSS selector of the element that receives the HTML.
   * @param {Function} [callback] - `(err, response) => void`; `err` is set on failure.
   */
  $.includeHTML = function (url, targetSelector, callback) {
    const target = $(targetSelector).first();
    if (target.length === 0) {
      if (isFn(callback)) callback(new Error('Target element not found'));
      return;
    }
    $.ajax({
      url: url,
      method: 'GET',
      success: (response) => {
        target.html(response);
        if (isFn(callback)) callback(null, response);
      },
      error: (err) => {
        if (isFn(callback)) callback(err);
      }
    });
  }

  /**
   * Create a DOM element from a tag name, attributes and children.
   * @param {string} tagName - Tag to create.
   * @param {Object} [attributes] - Properties to assign; special-cased: `class`,
   * object-valued `style`, and `data-*` keys become attributes.
   * @param {Element|string|r|Array} [children] - Child elements, HTML strings, collections or a mix.
   * @returns {Element|null} The new element, or `null` when `tagName` is not a string.
   */
  $.createElement = function (tagName, attributes = {}, children = []) {
    if (!isStr(tagName)) return null;
    const el = document.createElement(tagName);
    if (isObj(attributes)) {
      Object.keys(attributes).forEach(key => {
        if (key === 'class') {
          el.className = attributes[key];
        } else if (key === 'style' && isObj(attributes[key])) {
          Object.keys(attributes[key]).forEach(styleKey => {
            el.style[styleKey] = attributes[key][styleKey];
          });
        } else if (key.startsWith('data-')) {
          el.setAttribute(key, attributes[key]);
        }
        else {
          el[key] = attributes[key];
        }
      });
    }
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Element) {
          el.appendChild(child);
        } else if (isStr(child)) {
          el.insertAdjacentHTML('beforeend', child);
        } else if (child instanceof r) {
          child.each(grandChild => el.appendChild(grandChild));
        }
        // Ignore other types
      });
    } else if (children instanceof Element) {
      el.appendChild(children);
    } else if (isStr(children)) {
      el.insertAdjacentHTML('beforeend', children);
    } else if (children instanceof r) {
      children.each(grandChild => el.appendChild(grandChild));
    } // Ignore other types
    return el;
  }

  /**
   * Run a function once the DOM is ready.
   * @param {Function} fn - Callback invoked with no arguments.
   * @returns {$} The `$` function (for chaining).
   */
  $.ready = function (fn) {
    if (isFn(fn)) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
      } else {
        fn();
      }
    }
    return this;
  }

  /**
   * Perform an XMLHttpRequest.
   * @param {Object} options - Request options.
   * @param {string} [options.method='GET'] - HTTP method.
   * @param {string} [options.url=''] - Request URL.
   * @param {*} [options.data=null] - Request body passed to `send`.
   * @param {Object<string,string>} [options.headers] - Request headers (replaces the defaults).
   * @param {Function} [options.success] - `(responseText) => void` for 2xx statuses.
   * @param {Function} [options.error] - `(statusText) => void` for network/HTTP errors.
   * @returns {XMLHttpRequest} The underlying request (for aborting, etc.).
   */
  $.ajax = function (options) {
    const defaults = {
      method: 'GET',
      url: '',
      data: null,
      headers: {
        'Content-Type': 'application/json'
      },
      success: () => { },
      error: () => { }
    };
    options = $.extend({}, defaults, options);
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url, true);
    Object.keys(options.headers).forEach(key => {
      xhr.setRequestHeader(key, options.headers[key]);
    });
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        options.success(xhr.response);
      } else {
        options.error(xhr.statusText);
      }
    };
    xhr.onerror = function () {
      options.error(xhr.statusText);
    };
    xhr.send(options.data);
    return xhr;
  }

  /**
   * Plugin registry living on the collection prototype.
   * @type {Object}
   */
  $.fn = r.prototype;
  /**
   * Register a plugin that becomes available as a chainable collection method.
   * @param {string} name - Method name to add to the collection prototype.
   * @param {Function} fn - `(element, ...args) => void`, executed with the element as `this`.
   * @returns {Error|undefined} An error when the arguments are invalid; nothing on success
   * (the name is left untouched if a method with it already exists).
   */
  $.fn.plugin = function (name, fn) {
    if (!isStr(name) || !isFn(fn)) return new Error('Invalid plugin');
    if (!$.fn[name]) $.fn[name] = function (...args) { return this.each(el => fn.call(el, ...args)); };
  };

  window.$ = $;
})();
