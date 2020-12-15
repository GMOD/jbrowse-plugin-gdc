/**
 * This is a little wrapper around `tsdx build` that helps to rename some files
 * since TSDX has some unexpected behavior around file naming. This behavior
 * will likely be fixed in v0.15.0, so this script may be unnecessary at that
 * point. See https://github.com/formium/tsdx/pull/669.
 */

const rimraf = require('rimraf')
const spawn = require('cross-spawn')
const fs = require('fs')

function main() {
  let { signal, status } = spawn.sync(
    'yarn',
    ['tsdx', 'build', '--format', 'umd', '--name', 'JBrowsePluginGDC'],
    { stdio: 'inherit' },
  )
  fs.renameSync('./dist', './tmpDist')
  if (signal || status) {
    process.exit(status || 1)
  }
  ;({ signal, status } = spawn.sync('yarn', ['tsdx', 'build'], {
    stdio: 'inherit',
  }))
  if (signal || status) {
    process.exit(status || 1)
  }
  fs.renameSync(
    './tmpDist/jbrowseplugingdc.umd.development.js',
    './dist/jbrowse-plugin-gdc.umd.development.js',
  )
  fs.renameSync(
    './tmpDist/jbrowseplugingdc.umd.development.js.map',
    './dist/jbrowse-plugin-gdc.umd.development.js.map',
  )
  fs.renameSync(
    './tmpDist/jbrowseplugingdc.umd.production.min.js',
    './dist/jbrowse-plugin-gdc.umd.production.min.js',
  )
  fs.renameSync(
    './tmpDist/jbrowseplugingdc.umd.production.min.js.map',
    './dist/jbrowse-plugin-gdc.umd.production.min.js.map',
  )
  rimraf.sync('./tmpDist')
}

main()
