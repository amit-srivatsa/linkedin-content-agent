import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const isShown = atom({ plugin: 'context-bar', key: 'isShown' } as const, false)

const BAR = 24

const tokens = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'context-bar',
      description: 'Show or hide the context bar above the chat input',
    })

    return next(e)
  })

  on('command.run', { command: 'context-bar' }, async ($) => {
    const shown = !(await read($, isShown))
    await update($, isShown, () => shown)

    return { text: shown ? 'Context bar shown.' : 'Context bar hidden.' }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!(await read($, isShown))) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const { context, cost } = await $.session.usage({ breakdown: 'summary' })
    const breakdown = context.breakdown

    if (context.tokens === undefined || !breakdown) return next(e)

    const used = Math.min(BAR, Math.round(((context.percent ?? 0) / 100) * BAR))
    const threshold = breakdown.autoCompactThreshold
    const compact = breakdown.isAutoCompactEnabled && threshold
      ? `compacts at ${tokens(threshold)}`
      : 'auto-compact off'

    return (
      <Box flexDirection="row">
        <Text dimColor>{`tokens ${tokens(context.tokens)} / ${tokens(context.window)}  `}</Text>
        <Text backgroundColor="blue">{' '.repeat(used)}</Text>
        <Text backgroundColor="gray">{' '.repeat(BAR - used)}</Text>
        <Text dimColor>{` ${context.percent ?? 0}%  ${compact}  $${cost.usd.toFixed(2)}`}</Text>
      </Box>
    )
  })
}
