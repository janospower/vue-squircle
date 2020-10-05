/*!
 * vue-squircle v0.0.2
 * (c) Janos Pauer
 * Released under the MIT License.
 */
'use strict';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: "v-squircle",
  props: {
    radius: {
      type: String,
      "default": '25px'
    },
    smoothing: {
      type: Number,
      "default": 4
    },
    padding: {
      type: String,
      "default": '25px'
    },
    background: {
      type: String,
      "default": 'hsla(0,0%,0%,0.5)'
    }
  },
  data: function data() {
    return {
      polygon: []
    };
  },
  methods: {
    squircle: function squircle(r) {
      return function (theta) {
        var x = Math.pow(Math.abs(Math.cos(theta)), 2 / r) * 50 * Math.sign(Math.cos(theta)) + 50;
        var y = Math.pow(Math.abs(Math.sin(theta)), 2 / r) * 50 * Math.sign(Math.sin(theta)) + 50;
        return {
          x: x,
          y: y
        };
      };
    },
    to_radians: function to_radians(deg) {
      return deg * Math.PI / 180;
    }
  },
  mounted: function mounted() {
    this.polygon = new Array(91).fill(0).map(function (x, i) {
      return i;
    }).map(this.to_radians) // Defined as deg => deg * Math.PI / 180 elsewhere
    .map(this.squircle(this.smoothing)) // We'll use a border-radius of 4
    .map(function (_ref) {
      var x = _ref.x,
          y = _ref.y;
      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10
      };
    }) // Round to the ones place
    .map(function (_ref2) {
      var x = _ref2.x,
          y = _ref2.y;
      return "".concat((x - 50) * 2, "% ").concat((y - 50) * 2, "%");
    });
    this.polygon.push('0% 0%');
  },
  computed: {
    style: function style() {
      return {
        '--v-squircle-radius': this.radius,
        '--v-squircle-smoothing': this.smoothing,
        '--v-squircle-padding': this.padding,
        '--v-squircle-polygon': 'polygon(' + this.polygon + ')',
        '--v-squircle-background': this.background
      };
    }
  }
}; //  from https://medium.com/@zubryjs/squircles-bringing-ios-7s-solution-to-rounded-rectangles-to-css-9fc35779aa65

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "v-squircle",
    style: _vm.style
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--slot"
  }, [_vm._t("default")], 2)]);
};

var __vue_staticRenderFns__ = [function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "v-squircle--background"
  }, [_c('div', {
    staticClass: "v-squircle--segment v-squircle--segment--top-left"
  }), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--filler"
  }), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--segment v-squircle--segment--top-right"
  }), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--filler"
  }), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--filler"
  }), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--filler"
  }), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--segment v-squircle--segment--bottom-left"
  }), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--filler"
  }), _vm._v(" "), _c('div', {
    staticClass: "v-squircle--segment v-squircle--segment--bottom-right"
  })]);
}];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-1d14d8a0_0", {
    source: ".v-squircle[data-v-1d14d8a0]{display:grid}.v-squircle--background[data-v-1d14d8a0]{display:grid;grid-template:var(--v-squircle-radius) auto var(--v-squircle-radius)/var(--v-squircle-radius) auto var(--v-squircle-radius)}.v-squircle--segment[data-v-1d14d8a0]{width:var(--v-squircle-radius);height:var(--v-squircle-radius);clip-path:var(--v-squircle-polygon)}.v-squircle--filler[data-v-1d14d8a0],.v-squircle--segment[data-v-1d14d8a0]{background-color:var(--v-squircle-background)}.v-squircle--segment--bottom-left[data-v-1d14d8a0]{transform:rotate(90deg)}.v-squircle--segment--top-left[data-v-1d14d8a0]{transform:rotate(180deg)}.v-squircle--segment--top-right[data-v-1d14d8a0]{transform:rotate(270deg)}.v-squircle--background[data-v-1d14d8a0],.v-squircle--slot[data-v-1d14d8a0]{grid-area:1/1/1/1}.v-squircle--slot[data-v-1d14d8a0]{padding:var(--v-squircle-padding)}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-1d14d8a0";
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

var index = {
  install: function install(Vue, options) {
    Vue.component("v-squircle", __vue_component__);
  }
};

module.exports = index;
