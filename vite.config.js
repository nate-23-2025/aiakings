import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev-only: serve the Vercel serverless functions in `api/` during `npm run dev`,
// so the voice demo (and outbound call) work locally without the Vercel CLI.
// Production is unaffected — Vercel runs the same files as real functions.
function devApiPlugin(env) {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        const name = req.url.split('?')[0].replace('/api/', '').replace(/\/$/, '')
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          const handler = mod.default
          // collect body
          let raw = ''
          await new Promise((r) => { req.on('data', (c) => (raw += c)); req.on('end', r) })
          let body = {}
          if (raw) { try { body = JSON.parse(raw) } catch { body = {} } }
          // ensure the handler sees env vars
          for (const [k, v] of Object.entries(env)) if (!process.env[k]) process.env[k] = v
          const shim = {
            status(code) { res.statusCode = code; return this },
            json(obj) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); return this },
            setHeader(k, v) { res.setHeader(k, v); return this },
          }
          await handler({ method: req.method, headers: req.headers, body }, shim)
        } catch (err) {
          server.config.logger.error(`[dev-api] ${name}: ${err?.stack || err}`)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Dev API error.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // load ALL vars (incl. non-VITE_) for the dev API
  return {
    plugins: [react(), tailwindcss(), devApiPlugin(env)],
  }
})
