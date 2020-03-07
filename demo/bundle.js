
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
  'use strict';

  const shadowRoot = Symbol("#shadowRoot");
  const template = Symbol("#template");
  const dom = Symbol("#dom");
  const patchDOM = Symbol("#patchDOM");
  const patchStyles = Symbol("#patchStyles");

  class BaseComponent extends HTMLElement {
    constructor() {
      super();
      this[shadowRoot] = this.attachShadow({ mode: "open" });

      const id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
      this.setAttribute("id", id);
      this.id = id;

      this[patchStyles]();
      this[patchDOM]();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this[name] = newValue;
        this[patchDOM]();
      }
    }

    [patchDOM]() {
      if (!this.render) return

      const patch = this.render();

      if (typeof patch !== "string") return

      if (!this[template]) {
        this[template] = document.createElement("template");
        this[template].innerHTML = patch.trim();

        // check for multiple children?

        this[shadowRoot].appendChild(this[template].content);
        this[dom] = this[shadowRoot].lastElementChild;
      } else {
        if (this[dom].outerHTML === patch) return

        this[template].innerHTML = patch.trim();

        // check for multiple children?

        this[dom].replaceWith(this[template].content);
        this[dom] = this[shadowRoot].lastElementChild;
      }
    }

    [patchStyles]() {
      if (!this.styles) return

      const styles = this.styles();

      if (typeof styles === "string") {
        const style = document.createElement("style");
        style.type = "text/css";
        style.textContent = styles;
        this[shadowRoot].appendChild(style);
      }
    }
  }

  const register = (name, constructor) => {
    if (!customElements.get(name)) {
      customElements.define(name, constructor);
    }
  };

  var css = "/*! minireset.css v0.0.5 | MIT License | github.com/jgthms/minireset.css */blockquote,body,dd,dl,dt,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,html,iframe,legend,li,ol,p,pre,textarea,ul{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:400}ul{list-style:none}button,input,select,textarea{margin:0}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit}img,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0;text-align:start}:host{display:inline-block;box-sizing:border-box}:host[hidden]{display:none}p{text-align:center;margin:0}p .some-class{background:salmon}";

  class MiniGreeter extends BaseComponent {
    constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);
      this.setButtonHandler();
    }

    // setup

    static get observedAttributes() {
      return ["name"]
    }

    styles() {
      return css
    }

    setButtonHandler() {
      const button = this.shadowRoot.querySelector("#updater");
      button.addEventListener("click", this.handleClick);
    }

    // properties

    get name() {
      return this.getAttribute("name")
    }

    set name(value) {
      if (value) {
        this.setAttribute("name", value);
      } else {
        this.removeAttribute("name");
      }
    }

    // handlers

    handleClick() {
      const names = ["Jerry", "Louise", "George", "Brandon"];
      this.name = names[Math.floor(Math.random() * Math.floor(names.length))];
    }

    // render

    render() {
      return `
      <div class="some-class">
        <p>Whaddup Mr. ${this.name}.</p>
        <button id="updater">Update name</button>
      </div>
    `
    }
  }

  register("mini-greeter", MiniGreeter);

}());
