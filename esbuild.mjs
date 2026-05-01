import fs from 'node:fs'
import http from 'node:http'
import * as esbuild from 'esbuild'
import { globalExternals } from '@fal-works/esbuild-plugin-global-externals'
import JBrowseReExports from '@jbrowse/core/ReExports/list'
import prettyBytes from 'pretty-bytes'

const isWatch = process.argv.includes('--watch')
const PORT = process.env.PORT ? +process.env.PORT : 9000

function createGlobalMap(jbrowseGlobals) {
  const globalMap = {}
  for (const global of jbrowseGlobals) {
    globalMap[global] = {
      varName: `JBrowseExports["${global}"]`,
      type: 'cjs',
    }
  }
  // Map @jbrowse/mobx-state-tree to mobx-state-tree for backwards compatibility
  globalMap['@jbrowse/mobx-state-tree'] = {
    varName: `JBrowseExports["mobx-state-tree"]`,
    type: 'cjs',
  }
  // Expose BaseFeatureDetail sub-components from jbrowse's lazyMap
  const baseDetail = '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
  for (const name of ['BaseCard', 'FeatureDetails']) {
    globalMap[`${baseDetail}/${name}`] = {
      varName: `JBrowseExports["${baseDetail}"]["${baseDetail}/${name}"]`,
      type: 'cjs',
    }
  }
  return globalMap
}

const rebuildLogPlugin = {
  name: 'rebuild-log',
  setup({ onStart, onEnd }) {
    let time
    onStart(() => {
      time = Date.now()
    })
    onEnd(({ metafile, errors, warnings }) => {
      console.log(
        `Built in ${Date.now() - time} ms with ${errors.length} error(s) and ${warnings.length} warning(s)`,
      )
      if (metafile) {
        for (const [file, metadata] of Object.entries(metafile.outputs)) {
          console.log(`Wrote ${prettyBytes(metadata.bytes)} to ${file}`)
        }
      }
    })
  },
}

const globals = JBrowseReExports
const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  globalName: 'JBrowsePluginGDC',
  metafile: true,
  plugins: [globalExternals(createGlobalMap(globals)), rebuildLogPlugin],
  ...(isWatch
    ? { outfile: 'dist/out.js' }
    : {
        outfile: 'dist/jbrowse-plugin-gdc.umd.production.min.js',
        sourcemap: true,
        minify: true,
      }),
}

if (isWatch) {
  const ctx = await esbuild.context(config)
  const internalPort = PORT + 400
  const { hosts } = await ctx.serve({ servedir: '.', port: internalPort })

  http
    .createServer((req, res) => {
      const proxyReq = http.request(
        {
          hostname: hosts[0],
          port: internalPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        proxyRes => {
          res.writeHead(proxyRes.statusCode, {
            ...proxyRes.headers,
            'Access-Control-Allow-Origin': '*',
          })
          proxyRes.pipe(res, { end: true })
        },
      )
      req.pipe(proxyReq, { end: true })
    })
    .listen(PORT)

  console.log(`Serving at http://${hosts[0]}:${PORT}`)
  await ctx.watch()
  console.log('Watching files...')
} else {
  const result = await esbuild.build(config)
  fs.writeFileSync('meta.json', JSON.stringify(result.metafile))
}
