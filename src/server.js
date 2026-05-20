import { createServer } from 'node:http';
import { withJSON } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = createServer(async (req, res) => {

  const { method, url } = req
  await withJSON(req, res)

  const route = routes.find(r => {
    return r.method === method && r.path.test(url)
  })

  if (route) {
    const { groups } = url.match(route.path)

    const { query, ...rest } = groups

    req.params = rest

    try {
      req.query = extractQueryParams(url || '')
    } catch (error) {
      req.query = null
    }

    try {
      await route.handler(req, res);
      return;
    } catch (error) {
      console.log(error)
      return res.writeHead(error.code || 400).end(JSON.stringify({
        errorMessage: error.message
      }))
    }
  }

  res.writeHead(404).end()
})

server.listen(3333)