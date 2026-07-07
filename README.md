# MRE — `reply.setCookie()` is a silent no-op with `hook: false`

Minimal reproducible example for [`@fastify/cookie`](https://github.com/fastify/fastify-cookie).

When the plugin is registered with `hook: false`, `reply.setCookie()` succeeds
and returns `reply`, but **no `Set-Cookie` header is written**. The docs state
`hook` controls cookie *parsing* only ("disable cookie autoparsing"), so
disabling the write path as well is unexpected — and silent.

## Run

```sh
npm install
node index.js
```

## Expected

```
set-cookie : foo=bar; Path=/; SameSite=Lax
```
Process exits `0`.

## Actual

```
set-cookie : undefined

BUG: Set-Cookie header is missing when @fastify/cookie is registered with hook:false
```
Process exits `1` (assertion fails).

## Environment

- `@fastify/cookie`: 11.0.2
- `fastify`: 5.10.0
- `node`: 22
