'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_HOST: '"https://www.51bjhzy.com"'  //灰度
  // API_HOST: '"http://192.168.1.104:8200"'  //测试
  API_HOST: '"http://192.168.1.104:9090"'  //测试cls

  // API_HOST: '"https://service.51bjhzy.com"'  //线上
})
