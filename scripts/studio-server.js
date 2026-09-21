import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'

/**
 * Dev-only endpoints behind the recording studio (/#/studio).
 *
 * A reciter records each clip in the browser; this writes it straight to the file the app already
 * expects, converted to mp3. Nothing here ships in a production build — it is only mounted on the
 * Vite dev server.
 *
 *   POST /__studio/clip     raw audio body, `x-clip-path` header  -> writes public/<path>
 *   POST /__studio/timings  { "<word id>": seconds, ... }         -> rewrites fullMantraAt in src/data
 *   GET  /__studio/status                                          -> which clips exist, and their size
 */
const CLIP_PATH = /^\/audio\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/[a-z0-9-]+\.mp3$/
const WORD_ID = /^[a-z0-9-]+$/

export function studioServer() {
  return {
    name: 'mantramitra-studio',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root
      const publicDir = join(root, 'public')

      server.middlewares.use('/__studio', async (req, res) => {
        const url = req.url.split('?')[0]
        try {
          if (req.method === 'GET' && url === '/status') return json(res, status(publicDir))
          if (req.method === 'POST' && url === '/clip') return json(res, await saveClip(req, publicDir))
          if (req.method === 'POST' && url === '/timings') return json(res, await saveTimings(req, root))
          res.statusCode = 404
          res.end('not found')
        } catch (err) {
          res.statusCode = 400
          json(res, { error: String(err.message || err) })
        }
      })
    },
  }
}

const json = (res, body) => {
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(body))
}

const body = (req) =>
  new Promise((ok, fail) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => ok(Buffer.concat(chunks)))
    req.on('error', fail)
  })

/** Writes one recording. The clip path is validated and always resolved inside public/audio. */
async function saveClip(req, publicDir) {
  const clipPath = req.headers['x-clip-path']
  if (!CLIP_PATH.test(clipPath || '')) throw new Error(`bad clip path: ${clipPath}`)
  const dest = resolve(publicDir, clipPath.slice(1))
  if (!dest.startsWith(resolve(publicDir, 'audio'))) throw new Error('clip path escapes public/audio')

  const audio = await body(req)
  if (audio.length < 1024) throw new Error('recording is empty')
  mkdirSync(dirname(dest), { recursive: true })

  // Browser gives webm/opus; normalise loudness and write the mp3 the app already points at.
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', 'pipe:0', '-af', 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,areverse,loudnorm=I=-18:TP=-1.5:LRA=11', '-ac', '1', '-ar', '44100', '-b:a', '128k', dest], audio)
  return { ok: true, path: clipPath, bytes: statSync(dest).size }
}

/** Writes tapped word timings back into the content files, same field the generator uses. */
async function saveTimings(req, root) {
  const times = JSON.parse((await body(req)).toString('utf8'))
  const entries = Object.entries(times)
  if (!entries.length || entries.some(([id, t]) => !WORD_ID.test(id) || typeof t !== 'number')) {
    throw new Error('expected { "<word id>": seconds }')
  }
  let written = 0
  for (const name of ['gayatri.js', 'shivTandav.js']) {
    const file = join(root, 'src', 'data', name)
    const before = await readFile(file, 'utf8')
    let after = before
    for (const [id, t] of entries) {
      after = after.replace(new RegExp(`(id: '${id}'.*?fullMantraAt: )[^ }]+`), `$1${Math.round(t * 100) / 100}`)
    }
    if (after !== before) {
      await writeFile(file, after)
      written++
    }
  }
  return { ok: true, words: entries.length, filesUpdated: written }
}

function status(publicDir) {
  const seen = {}
  const walk = (dir, prefix) => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name)
      if (entry.isDirectory()) walk(p, `${prefix}/${entry.name}`)
      else if (entry.name.endsWith('.mp3')) seen[`${prefix}/${entry.name}`] = statSync(p).size
    }
  }
  walk(join(publicDir, 'audio'), '/audio')
  return seen
}

function run(cmd, args, input) {
  return new Promise((ok, fail) => {
    const p = spawn(cmd, args)
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('error', fail)
    p.on('close', (code) => (code === 0 ? ok() : fail(new Error(`${cmd} failed: ${err.slice(0, 300)}`))))
    p.stdin.end(input)
  })
}
