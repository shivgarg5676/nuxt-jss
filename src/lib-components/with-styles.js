import jss, { SheetsManager } from 'jss'
import { getKey } from './key-generator'
export default {
  data() {
    return {
      sheet: {},
      sheetStr: ''
    }
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
      return this.sheet.classes
    }
  },
  watch: {
    theme: {
      deep: true,
      handler() {
        this.generateSheet()
      }
    }
  },
  created() {
    this.generateSheet()
  },
  mounted() {
    // remove this after we can fallback to server side config.
    this.$forceUpdate()
  },
  destroyed() {
    this.getSheetManager().unmanage(this.theme)
  },
  methods: {
    generateSheet() {
      const sheetsManager = this.getSheetManager()
      const themeKey = getKey()
      const oldSheet = sheetsManager.get(themeKey)
      let sheet
      if (oldSheet) {
        sheet = oldSheet
        this.sheet = sheet
      } else {
        sheet = jss.createStyleSheet(this.$options.styles)
        sheet = sheet.update(this.theme)
        sheetsManager.add(themeKey, sheet)
        if (process.server) {
          this.sheets.add(sheet)
        }
      }
      this.sheet = sheetsManager.manage(themeKey)
    },
    getSheetManager() {
      if (!this.constructor.sheetsManager) {
        this.constructor.sheetsManager = new SheetsManager()
      }
      return this.constructor.sheetsManager
    }
  }
}
