let key = {
  key: 'value'
}

const generateNewKey = function() {
  key = {
    key: 'value'
  }
}
const getKey = function() {
  if (!key) {
    generateNewKey()
  }
  return key
}

export { generateNewKey, getKey }
