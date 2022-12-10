import solid from 'solid-start/vite';
import autoImport from 'unplugin-auto-import/vite';
import { qrcode } from 'vite-plugin-qrcode';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  server: {
    host: true,
  },
  plugins: [
    qrcode(),
    solid({
      ssr: false,
      adapter: 'solid-start-vercel',
      babel: {
        plugins: [['babel-plugin-solid-labels', { dev: command === 'serve' }]],
      },
    }),
    autoImport({
      sourceMap: true,
      dirs: ['src/primitives', 'src/components'],
      defaultExportByFilename: true,
      imports: ['solid-js'],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
}));
