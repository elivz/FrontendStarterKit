/**
 * Convert an array-like object to a true array
 *
 * @param {nodelist} object  A NodeList or other array-like object
 * @return {array}
 */
export const toArray = function toArray(object) {
  return Array.prototype.slice.call(object);
};

/**
 * Helper that get the first element in the document matching a particular selector
 *
 * @param {mixed} target
 * @param {element} context to query
 * @return {array}
 */
export const $ = function $(target, context) {
  return (context || document).querySelector(target, context);
};

/**
 * Helper that converts the result of querySelectorAll to a plain array
 *
 * @param {mixed} target
 * @param {element} context to query
 * @return {array}
 */
export const $$ = function $$(target, context) {
  let nodes = [];

  if (target instanceof Array) {
    target.forEach(item => {
      if (item instanceof Node) {
        nodes.push(item);
      }
    });
  }

  if (target instanceof NodeList) {
    nodes = toArray(target);
  }

  if (target instanceof Element) {
    nodes = [target];
  }

  if (typeof target === `string`) {
    nodes = toArray((context || document).querySelectorAll(target, context));
  }

  return nodes;
};

/**
 * Find the closest parent of an element that matches a given CSS selector
 *
 * @param {node} node       DOM element to start from
 * @param {string} selector CSS selector to match against
 */
export const closest = function closest(node, selector) {
  if (node && node !== document.body) {
    let current = node;
    while (current.parentElement && !current.parentElement.matches(selector)) {
      current = current.parentElement;
    }
    if (current.parentElement) {
      return current.parentElement;
    }
  }
  return false;
};

/**
 * Handle events, either by binding a callback function to the target
 * element, or by creating an intermediary function that checks to see
 * if the event target matches a selector string
 *
 * @param {node} node             A DOM element to bind to
 * @param {function} handler      The callback function
 * @param {string} childSelector  CSS selector string to match against
 * @return {function}
 */
const getBoundCallback = (node, handler, childSelector) => {
  if (!childSelector) {
    return handler.bind(node);
  }

  return (...args) => {
    const target = closest(args[0], childSelector);
    return target ? handler.apply(target, args) : null;
  };
};

/**
 * Attach an event handler to one or more nodes
 *
 * @param {node or array} target A DOM element or array of elements
 * @param {string} event         Event to listen for
 * @param {function} callback    Function to attach
 * @return {function}            Call the returned function to remove the listener
 */
export const on = function on(target, event, ...args) {
  let handler;
  let childSelector;

  if (args.length === 1) {
    [handler] = args;
  } else {
    [, handler] = args;
    [childSelector] = args;
  }

  const callback = getBoundCallback(target, handler, childSelector);

  $$(target).forEach(node => {
    node.addEventListener(event, callback);
  });

  return () => {
    toArray(target).forEach(node => {
      node.removeEventListener(event, callback);
    });
  };
};
