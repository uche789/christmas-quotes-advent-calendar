import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { staticFileMiddleware } from './staticFileMiddleware.ts';
import { parse } from 'https://deno.land/std/flags/mod.ts';
import { Result } from "./interfaces.ts";

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

router.get('/cards', async ({ response, request, params }) => {
  const hasFake = request.url.search.includes('fake=true')
  response.headers.set('Content-type', 'application/json')
  let info = {
    quotes: [] as string[],
    icons: [] as string[],
  }

  try {
    const response = await Deno.readTextFile("./src/icons.json");
    info.icons = JSON.parse(response)
  } catch {
    response.status = 404
    response.body = {error: 404, message: 'not found'}
    return
  }

  try {
    const response = await Deno.readTextFile("./src/quotes.json");
    info.quotes = JSON.parse(response)
  } catch {
    response.status = 404
    response.body = {error: 404, message: 'not found'}
    return
  }

  const results: Result[] = []
  const date = new Date()
  const days = hasFake ? 28 : 31

  if (date.getMonth() !== 11 && !hasFake) {
    response.body = []
    return
  }

  for (let i = 0; i < (info.quotes.length - info.icons.length); i++) {
    info.icons.push(info.icons[i])
  }

  for (let i = 1; i <= days; i++) {
    const result: Result = {
      day: i,
      icon: info.icons[i],
      quote: info.quotes[i],
      isSeen: date.getDate() >= i
    }
    results.push(result)
  }

  response.body = results
})

app.use(router.routes())
app.use(router.allowedMethods())
await app.listen(`${HOST_NAME}:${port}`)
