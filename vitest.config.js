import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    cache: false,
    isolate: false,
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
})
