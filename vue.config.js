'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    productionSourceMap: false,
    configureWebpack: {
        name: defaultSettings.title,
        resolve: {
            alias: {
                '@': resolve('src'),
                '@mv': resolve('src') + '\\views\\m'
            }
        }
    }
}