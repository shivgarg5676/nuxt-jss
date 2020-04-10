import jss, { SheetsManager, SheetsRegistry } from 'jss';
import preset from 'jss-preset-default';

let key = {
  key: 'value'
};

const generateNewKey = function () {
  key = {
    key: 'value'
  };
};

const getKey = function () {
  if (!key) {
    generateNewKey();
  }

  return key;
};

var withStyles = {
  data() {
    return {
      sheet: {},
      sheetStr: ''
    };
  },

  inject: {
    theme: {
      default: {}
    },
    sheets: {
      default: null
    }
  },
  computed: {
    classes() {
      return this.sheet.classes;
    }

  },
  watch: {
    theme: {
      deep: true,

      handler() {
        this.generateSheet();
      }

    }
  },

  created() {
    this.generateSheet();
  },

  mounted() {
    // remove this after we can fallback to server side config.
    this.$forceUpdate();
  },

  destroyed() {
    this.getSheetManager().unmanage(this.theme);
  },

  methods: {
    generateSheet() {
      const sheetsManager = this.getSheetManager();
      const themeKey = getKey();
      const oldSheet = sheetsManager.get(themeKey);
      let sheet;

      if (oldSheet) {
        sheet = oldSheet;
        this.sheet = sheet;
      } else {
        sheet = jss.createStyleSheet(this.$options.styles);
        sheet = sheet.update(this.theme);
        sheetsManager.add(themeKey, sheet);

        if (process.server) {
          this.sheets.add(sheet);
        }
      }

      this.sheet = sheetsManager.manage(themeKey);
    },

    getSheetManager() {
      if (!this.constructor.sheetsManager) {
        this.constructor.sheetsManager = new SheetsManager();
      }

      return this.constructor.sheetsManager;
    }

  }
};

//
jss.setup(preset());
var script = {
  name: 'ThemeProvider',
  props: {
    theme: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data() {
    return {
      sheets: new SheetsRegistry()
    };
  },

  provide() {
    return {
      theme: this.theme,
      sheets: this.sheets
    };
  },

  computed: {
    sheetStr() {
      return this.sheets.toString();
    }

  },
  watch: {
    theme: {
      deep: true,

      handler() {
        generateNewKey();
      }

    }
  },

  created() {
    // remove ssr styles from meta and fallback to attach method.
    if (process.client) {
      this.$meta().refresh();
    }
  },

  head() {
    return {
      style: [{
        cssText: this.sheetStr,
        type: 'text/css'
      }]
    };
  }

};

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

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    attrs: {
      "id": "themeProvider"
    }
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);



var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  withStyles: withStyles,
  ThemeProvider: __vue_component__
});

// Import vue components

const install = function installNuxtJss(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

let GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // Default export is library as a whole, registered via Vue.use()

export default plugin;
export { __vue_component__ as ThemeProvider, withStyles };
