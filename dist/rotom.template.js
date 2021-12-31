(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('omdomdom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'omdomdom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rotom = {}, global.omdomdom));
}(this, (function (exports, omdomdom) { 'use strict';

  const createUUID = () => {
    const base = Number.MAX_SAFE_INTEGER;
    return Math.floor(Math.random() * base).toString(36) + Math.abs(Date.now()).toString(36);
  };

  const getTypeTag$1 = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  const isPlainObject = value => getTypeTag$1(value) === "object";
  const isEmptyObject = value => {
    if (!isPlainObject(value)) return false;

    for (let key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return false;
      }
    }

    return true;
  };
  const isFunction$1 = value => getTypeTag$1(value) === "function";
  const isString$1 = value => getTypeTag$1(value) === "string";
  const isUndefined = value => getTypeTag$1(value) === "undefined";

  const toKebabCase = value => value && value.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join("-");

  const sanitizeString = value => {
    const dump = document.createElement("div");
    dump.textContent = value;
    return "" + dump.innerHTML;
  };

  function log(msg, type = "warn") {
    console[type]("[Rotom]: ".concat(msg));
  }

  function createScheduler() {
    const requestAnimationFrame = window.requestAnimationFrame;
    const setTimeout = window.setTimeout;
    const FRAME_DURATION = 1000 / 60;
    let scheduled = null;

    function schedule(fn) {
      if (scheduled) return;

      if (isFunction$1(requestAnimationFrame)) {
        scheduled = requestAnimationFrame(() => {
          scheduled = null;
          fn();
        });
      } else if (isFunction$1(setTimeout)) {
        scheduled = setTimeout(() => {
          scheduled = null;
          fn();
        }, FRAME_DURATION);
      }
    }

    return fn => schedule(fn);
  }

  const Attributes = {
    dir: "dir"
  };
  const AttributeValues = {
    ltr: "ltr"
  };
  const External = {
    rotomIdProperty: "rotomId",
    requestRender: "requestRender",
    render: "render",
    staticProperties: "properties",
    staticStyles: "styles",
    rotomIdAttribute: "rotom-id",
    onConnect: "onConnect",
    onMount: "onMount",
    onUpdate: "onUpdate",
    onPropertyChange: "onPropertyChange",
    onAttributeChange: "onAttributeChange",
    onUnmount: "onUnmount"
  };
  const Internal = {
    rotomId: Symbol("#rotomId"),
    vDOM: Symbol("#vDOM"),
    isFirstRender: Symbol("#isFirstRender"),
    renderer: Symbol("#renderer"),
    initialize: Symbol("#initialize"),
    schedule: Symbol("#schedule"),
    runLifecycle: Symbol("#runLifecycle"),
    upgrade: Symbol("#upgrade"),
    upgradeProperties: Symbol("#upgradeProperties"),
    renderStyles: Symbol("#renderStyles"),
    renderDOM: Symbol("#renderDOM"),
    patch: Symbol("#patch"),
    destroy: Symbol("#destroy")
  };

  function validateType(Instance, propName, value, type) {
    if (typeof type === "undefined") return;
    const evaluatedType = getTypeTag$1(value);
    if (type === undefined || evaluatedType === type) return;
    log("Property '".concat(propName, "' is invalid type of '").concat(evaluatedType, "'. Expected '").concat(type, "'. Check ").concat(Instance.constructor.name, "."));
  }

  const initializePropertyValue = (RotomInstance, propName, configuration, privateName) => {
    const {
      default: defaultValue,
      type: propType,
      reflected = false,
      safe = false
    } = configuration;
    let initialValue;

    if (isFunction$1(defaultValue)) {
      initialValue = defaultValue(RotomInstance);
    } else if (typeof RotomInstance[propName] !== "undefined") {
      initialValue = RotomInstance[propName];
      RotomInstance["__".concat(propName, "_initial")] = initialValue;
    } else {
      initialValue = defaultValue;
    }

    if (!isUndefined(initialValue)) {
      {
        validateType(RotomInstance, propName, initialValue, propType);
      }

      if (safe && typeof initialValue === "string") {
        initialValue = sanitizeString(initialValue);
      }

      RotomInstance[privateName] = initialValue;
    }

    if (reflected) {
      const initialAttrValue = initialValue ? String(initialValue) : "";
      const attribute = toKebabCase(propName);
      RotomInstance.setAttribute(attribute, initialAttrValue);
    }
  };

  const upgradeProperty = (RotomInstance, propName, configuration = {}) => {
    if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(RotomInstance), propName)) {
      return;
    }

    const privateName = Symbol(propName);
    const {
      type,
      reflected = false,
      safe = false
    } = configuration;
    initializePropertyValue(RotomInstance, propName, configuration, privateName);
    Object.defineProperty(RotomInstance, propName, {
      configurable: true,
      enumerable: true,

      get() {
        return RotomInstance[privateName];
      },

      set(value) {
        if (value === RotomInstance[privateName]) return;

        {
          validateType(RotomInstance, propName, value, type);
        }

        const oldValue = RotomInstance[privateName];

        if (!isUndefined(value)) {
          RotomInstance[privateName] = safe && type === "string" && typeof value === "string" ? sanitizeString(value) : value;
          RotomInstance[Internal.runLifecycle](External.onPropertyChange, propName, oldValue, value);

          if (reflected) {
            const attribute = toKebabCase(propName);
            const attrValue = String(value);
            RotomInstance.setAttribute(attribute, attrValue);
          }
        } else {
          delete RotomInstance[privateName];
          RotomInstance[Internal.runLifecycle](External.onPropertyChange, propName, oldValue, value);

          if (reflected) {
            const attribute = toKebabCase(propName);
            RotomInstance.removeAttribute(attribute);
          }
        }

        RotomInstance[External.requestRender]();
      }

    });
  };

  const SHADOW_ROOT_MODE = "open";
  function rotomFactory(renderer) {
    return class Rotom extends HTMLElement {
      constructor() {
        super();
        this[Internal.schedule] = createScheduler();
        this[Internal.renderer] = renderer({
          Internal,
          External
        });
        this.attachShadow({
          mode: SHADOW_ROOT_MODE
        });
        this[Internal.patch] = this[Internal.patch].bind(this);
        this[Internal.isFirstRender] = true;
        this[Internal.vDOM] = null;
        this[Internal.rotomId] = createUUID();
      }

      static get observedAttributes() {
        const properties = this[External.staticProperties];
        if (isEmptyObject(properties)) return [];
        let attributes = [];

        for (let propName in properties) {
          if (!properties[propName].reflected) continue;
          attributes.push(toKebabCase(propName));
        }

        return attributes;
      }

      adoptedCallback() {}

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
          this[Internal.runLifecycle](External.onAttributeChange, name, oldValue, newValue);
        }
      }

      connectedCallback() {
        if (!this.isConnected) return;
        this[Internal.upgrade]();
        this[Internal.runLifecycle](External.onConnect);
        this[Internal.renderStyles]();
        this[External.requestRender]();
      }

      disconnectedCallback() {
        this[Internal.runLifecycle](External.onUnmount);
        this[Internal.destroy]();
      }

      get [External.rotomIdProperty]() {
        return this[Internal.rotomId];
      }

      [External.requestRender]() {
        this[Internal.schedule](this[Internal.patch]);
      }

      [Internal.runLifecycle](methodName, ...args) {
        if (isFunction$1(this[methodName])) {
          this[methodName](...args);
        }
      }

      [Internal.upgrade]() {
        this.setAttribute(External.rotomIdAttribute, this[External.rotomIdProperty]);
        this.setAttribute(Attributes.dir, String(document.dir || AttributeValues.ltr));
        this[Internal.upgradeProperties]();
      }

      [Internal.upgradeProperties]() {
        const properties = this.constructor[External.staticProperties];
        if (isEmptyObject(properties)) return;

        for (let propName in properties) {
          upgradeProperty(this, propName, properties[propName]);
        }
      }

      [Internal.destroy]() {
        this[Internal.renderer].destroy(this);
      }

      [Internal.patch]() {
        this[Internal.renderer].patch(this);
      }

      [Internal.renderStyles]() {
        const styles = this.constructor[External.staticStyles];
        if (!isString$1(styles)) return;
        const styleTag = document.createElement("style");
        styleTag.type = "text/css";
        styleTag.textContent = styles;
        this.shadowRoot.appendChild(styleTag);
      }

    };
  }

  const getTypeTag = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

  const isFunction = value => getTypeTag(value) === "function";
  const isString = value => getTypeTag(value) === "string";

  function renderer({
    Internal,
    External
  }) {
    function getRenderState(element) {
      let domString;

      if (isFunction(element[External.render])) {
        domString = element[External.render]();
      } else {
        throw new Error("[Rotom]: You must include a render method in element: '".concat(element.constructor.name, "'"));
      }

      if (!isString(domString)) {
        throw new Error("[Rotom]: You attempted to render a non-string template in element: '".concat(element.constructor.name, "'."));
      }

      return domString;
    }

    function setInitialRenderState(element) {
      element[Internal.vDOM] = omdomdom.create(getRenderState(element));
      omdomdom.render(element[Internal.vDOM], element.shadowRoot);
      element[Internal.runLifecycle](External.onMount);
    }

    function setNextRenderState(element) {
      let nextVDOM = omdomdom.create(getRenderState(element));
      omdomdom.patch(nextVDOM, element[Internal.vDOM]);
      element[Internal.runLifecycle](External.onUpdate);
      nextVDOM = null;
    }

    return {
      patch(element) {
        if (!window || !window.document) return;

        if (element[Internal.isFirstRender]) {
          element[Internal.isFirstRender] = false;
          setInitialRenderState(element);
        } else {
          setNextRenderState(element);
        }
      },

      destroy(element) {
        if (!window || !window.document) return;
        const emptyVNode = {
          type: "comment",
          attributes: {},
          children: null,
          content: "",
          node: document.createComment("")
        };
        element[Internal.isFirstRender] = true;
        omdomdom.patch(emptyVNode, element[Internal.vDOM]);
        element[Internal.vDOM] = null;
        const children = element.shadowRoot.childNodes;

        if (children.length) {
          Array.prototype.forEach.call(children, child => element.shadowRoot.removeChild(child));
        }
      }

    };
  }

  function createDirectionObserver() {
    if (window.__ROTOM_ELEMENT__DIR_OBSERVER__) return;
    window.__ROTOM_ELEMENT__DIR_OBSERVER__ = true;

    const updateDirection = (context = document) => {
      const nodes = Array.apply(null, context.querySelectorAll("[rotom-id]"));
      if (!nodes.length) return;
      nodes.forEach(node => {
        node.setAttribute("dir", String(document.dir || "ltr"));

        if (node.shadowRoot) {
          updateDirection(node.shadowRoot);
        }
      });
    };

    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === "dir") {
          updateDirection();
        }
      });
    });
    mutationObserver.observe(document.documentElement, {
      attributes: true
    });
  }

  const register = (tag, RotomInstance) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, RotomInstance);
    }
  };

  createDirectionObserver();
  const Rotom = rotomFactory(renderer);

  exports.Rotom = Rotom;
  exports.register = register;
  exports.validateType = validateType;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=rotom.template.js.map
