/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack')
const {
  baseJBrowsePluginWebpackConfig,
} = require('@jbrowse/development-tools')

const package = require('./package.json')

const config = baseJBrowsePluginWebpackConfig(__dirname, package)
module.exports = config
