"use strict";

// Utility functions
; (() => {
  const isFn = (v) => typeof v === 'function';
  const isStr = (v) => typeof v === 'string';
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const toArray = (v) =>
    v == null ? [] : Array.isArray(v) ? v : [v];

  // Core constructor
  function r(elements) {
    this.length = 0;
    elements.forEach((el, i) => {
      this[i] = el;
      this.length++;
    });
  }

  // Iterate over elements
  r.prototype.each = function (fn) {
    for (let i = 0; i < this.length; i++) {
      fn.call(this[i], i, this[i]);
    }
    return this;
  }

  // Event handling
  r.prototype.on = function (event, handler) {
    return this.each(el => el.addEventListener(event, handler));
  }

  // Remove event handler
  r.prototype.off = function (event, handler) {
    return this.each(el => el.removeEventListener(event, handler));
  }

  // Add class to elements
  r.prototype.addClass = function (className) {
    return this.each(el => el.classList.add(className));
  }

  // Remove class from elements
  r.prototype.removeClass = function (className) {
    return this.each(el => el.classList.remove(className));
  }

  // Toggle class on elements
  r.prototype.toggleClass = function (className) {
    return this.each(el => el.classList.toggle(className));
  }

  // Add to css
  r.prototype.css = function (prop, value) {
    if (value == undefined) {
      return this.length > 0 ? getComputedStyle(this[0])[prop] : undefined;
    }

    return this.each(el => el.style[prop] = value);
  }

  // Select first element
  r.prototype.first = function () {
    return this.length > 0 ? new r([this[0]]) : new r([]);
  }

  // Select last element
  r.prototype.last = function () {
    return this.length > 0 ? new r([this[this.length - 1]]) : new r([]);
  }

  // Add attribute
  r.prototype.attr = function (name, value) {
    if (value == undefined) return this[0]?.getAttribute(name);
    return this.each(el => el.setAttribute(name, value));
  }

  // Remove attribute
  r.prototype.removeAttr = function (name) {
    return this.each(el => el.removeAttribute(name));
  }

  // Get or set HTML content
  r.prototype.html = function (html) {
    if (html == undefined) return this[0]?.innerHTML;
    return this.each(el => el.innerHTML = html);
  }

  // Get or set text content
  r.prototype.text = function (text) {
    if (text == undefined) return this[0]?.textContent;
    return this.each(el => el.textContent = text);
  }

  // Show elements
  r.prototype.show = function (display = 'block') {
    return this.each(el => {
      if (el.style.display === 'none') el.style.display = '';
      if (getComputedStyle(el).display === 'none') el.style.display = display;
    });
  }

  // Hide elements
  r.prototype.hide = function () {
    return this.each(el => el.style.display = 'none');
  }

  // Toggle visibility
  r.prototype.toggle = function (display = 'block') {
    return this.each(el => {
      if (getComputedStyle(el).display === 'none') {
        el.style.display = display;
      } else {
        el.style.display = 'none';
      }
    });
  }

  // Select parent elements
  r.prototype.parent = function () {
    const parents = [];
    this.each(el => {
      if (el.parentElement && !parents.includes(el.parentElement)) {
        parents.push(el.parentElement);
      } // Ignore if no parent or already added
    });
    return new r(parents);
  }

  // Select children elements
  r.prototype.children = function () {
    let children = [];
    this.each(el => {
      children = children.concat(toArray(el.children));
    });
    children = [...new Set(children)]; // Remove duplicates
    return new r(children);
  }

  // Find descendants matching selector
  r.prototype.find = function (selector) {
    let found = [];
    this.each(el => {
      found = found.concat(toArray(el.querySelectorAll(selector)));
    });
    found = [...new Set(found)]; // Remove duplicates
    return new r(found);
  }

  // Append content
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

  // Prepend content
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

  // Before content
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

  // After content
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

  // Main function
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

  // Extend Utility
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

  // Create element utility
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

  // Dom ready
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

  // Ajax method
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

  // Plugin system
  $.fn = r.prototype;
  $.fn.plugin = function (name, fn) {
    if (!isStr(name) || !isFn(fn)) return new Error('Invalid plugin');
    if (!$.fn[name]) $.fn[name] = function (...args) { return this.each(el => fn.call(el, ...args)); };
  };

  window.$ = $;
})();
