/**
 * Created by lifei on 2019/1/5.
 */

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
 