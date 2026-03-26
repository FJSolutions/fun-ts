import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      watch: false,
      include: ["./tests/**/*.test*(s).ts*(x)"],
      exclude: [
         "tests/sequence.tests.ts"
      ]
   },
});
