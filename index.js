'use strict'

const assert = require('node:assert')
const Fastify = require('fastify')
const fastifyCookie = require('@fastify/cookie')

async function main () {
  const app = Fastify()

  // Per the docs, `hook: false` only disables cookie *parsing* (autoparsing).
  // It should NOT affect setting cookies on the response.
  await app.register(fastifyCookie, { hook: false })

  app.get('/', (req, reply) => {
    reply.setCookie('foo', 'bar', { path: '/' }).send({ ok: true })
  })

  const res = await app.inject({ method: 'GET', url: '/' })
  await app.close()

  console.log('status     :', res.statusCode)
  console.log('set-cookie :', res.headers['set-cookie'])

  // Expected: 'foo=bar; Path=/; SameSite=Lax'
  // Actual  : undefined  ->  reply.setCookie() was a silent no-op
  assert.ok(
    res.headers['set-cookie'],
    'BUG: Set-Cookie header is missing when @fastify/cookie is registered with hook:false'
  )

  console.log('\nOK: Set-Cookie was written as expected.')
}

main().catch((err) => {
  console.error('\n' + err.message)
  process.exit(1)
})
