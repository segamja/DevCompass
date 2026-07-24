import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }

function getGitSha(): string {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  } catch {
    return 'dev'
  }
}

const gitSha = getGitSha()

function versionJsonPlugin(version: string, sha: string): Plugin {
  const writeVersionFile = () => {
    writeFileSync(
      path.resolve('public/version.json'),
      JSON.stringify({ version, sha, builtAt: new Date().toISOString() }, null, 2),
    )
  }

  return {
    name: 'devcompass-version-json',
    buildStart: writeVersionFile,
    configureServer: writeVersionFile,
  }
}

export default defineConfig({
  plugins: [react(), versionJsonPlugin(pkg.version, gitSha)],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_SHA__: JSON.stringify(gitSha),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
