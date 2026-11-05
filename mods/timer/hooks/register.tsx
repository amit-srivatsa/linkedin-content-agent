import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Run } from '../types'

const DEFAULT_MS = 15 * 60_000
const BAR = 20
const idle: Run = { endsAt: null, total: 0 }
const run = atom({ plugin: 'timer', key: 'run' } as const, idle)

const UNIT: Record<string, number> = {
  h: 3600_000, hr: 3600_000, hrs: 3600_000, hour: 3600_000, hours: 3600_000,
  m: 60_000, min: 60_000, mins: 60_000, minute: 60_000, minutes: 60_000,
  s: 1000, sec: 1000, secs: 1000, second: 1000, seconds: 1000,
}

// "20", "20m", "1h30m", "45 sec": a bare number counts as minutes.
export function parse(text: string): number {
  let total = 0
  for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*([a-z]*)/gi)) {
    const unit = m[2].toLowerCase()
    if (unit && !(unit in UNIT)) continue
    total += Number(m[1]) * (UNIT[unit] ?? 60_000)
  }

  return total > 0 ? total : DEFAULT_MS
}

const pad = (n: number) => String(n).padStart(2, '0')

function clock(ms: number): string {
  const s = Math.ceil(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60

  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

type $ = EngineInterface

async function stop($: $) {
  ticker?.cancel()
  ticker = undefined
  await update($, run, () => idle)
  $.ui.status(undefined)
}

let ticker: { cancel: () => void } | undefined

async function start($: $, ms: number) {
  ticker?.cancel()
  const endsAt = (await $.clock.now()) + ms
  await update($, run, () => ({ endsAt, total: ms }))

  ticker = $.clock.every(1000, async () => {
    const { endsAt, total } = await read($, run)
    if (endsAt === null) return

    const left = endsAt - (await $.clock.now())
    if (left <= 0) {
      await stop($)
      $.ui.toast(`Timer done: ${clock(total)} is up`)
      return
    }

    const filled = Math.round((1 - left / total) * BAR)
    $.ui.status(`⏱ ${'█'.repeat(filled)}${'░'.repeat(BAR - filled)} ${clock(left)} left`)
  })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'timer',
      description: 'Start a timer, e.g. /timer 20m (default 15 min). /timer stop ends it',
    })

    return next(e)
  })

  on('command.run', { command: 'timer' }, async ($, e) => {
    if (e.args.trim() === 'stop') {
      await stop($)

      return { text: 'Timer stopped.' }
    }

    const ms = parse(e.args)
    await start($, ms)

    return { text: `Timer started: ${clock(ms)}.` }
  })

  // "start a timer for 20 minutes" in plain words also starts it; the message still goes to the model.
  on('prompt.submit', async ($, e, next) => {
    const m = e.text.match(/\b(?:start|set)\s+(?:a|an|the\s+)?timer\b(?:\s+(?:for|of))?([^.!?\n]*)/i)
    if (m) await start($, parse(m[1] ?? ''))

    return next(e)
  })
}
