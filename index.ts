import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { staticFileMiddleware } from './staticFileMiddleware.ts';
import { parse } from 'https://deno.land/std/flags/mod.ts';

const HOST_NAME = "0.0.0.0"
const PORT = 8080
const { args } = Deno;
const argPort = parse(args).port;
const port = argPort ? Number(argPort) : PORT;

console.log(`HTTP webserver running.  Access it at:  http://localhost:${port}/`);

const app = new Application()
app.use(staticFileMiddleware)

const router = new Router()

router.get('/', async ({ response }) => {
    try {
      const text = await Deno.readTextFile("./src/index.html");
      response.body = text
    } catch {
      response.status = 404
      response.body = '404 - not found'
    }
})

router.get('/advent', async ({ response, params}) => {
  response.headers.set('Content-type', 'application/json')
  try {
    const text = await Deno.readTextFile("./src/quotes.json");
    response.body = text
  } catch {
    response.status = 404
    response.body = {error: 404, message: 'not found'}
  }
})

router.get('/icons', async ({ response }) => {
  response.headers.set('Content-type', 'application/json')
  try {
    const text = await Deno.readTextFile("./src/icons.json");
    response.body = text
  } catch {
    response.status = 404
    response.body = {error: 404, message: 'not found'}
  }
})

app.use(router.routes())
app.use(router.allowedMethods())
await app.listen(`${HOST_NAME}:${port}`)
