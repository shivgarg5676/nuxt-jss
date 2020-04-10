<template>
  <div id="themeProvider">
    <slot></slot>
  </div>
</template>
<script>
import jss, { SheetsRegistry } from 'jss'
import preset from 'jss-preset-default'
import { generateNewKey } from './key-generator'
jss.setup(preset())
export default {
  name: 'ThemeProvider',
  props: {
    theme: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      sheets: new SheetsRegistry()
    }
  },
  provide() {
    return {
      theme: this.theme,
      sheets: this.sheets
    }
  },
  computed: {
    sheetStr() {
      return this.sheets.toString()
    }
  },
  watch: {
    theme: {
      deep: true,
      handler() {
        generateNewKey()
      }
    }
  },
  created() {
    // remove ssr styles from meta and fallback to attach method.
    if (process.client) {
      this.$meta().refresh()
    }
  },
  head() {
    return {
      style: [{ cssText: this.sheetStr, type: 'text/css' }]
    }
  }
}
</script>
