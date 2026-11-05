export type Run = { endsAt: number | null; total: number }

declare module 'claude-code' {
  interface PluginState {
    timer: { run: Run }
  }
}
