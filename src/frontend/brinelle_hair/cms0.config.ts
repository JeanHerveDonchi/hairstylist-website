import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) })
import { defineConfig } from "@cms0/cms0/config";

function getRequiredEnv(key: 'VITE_CMS0_API_BASEURL' | 'VITE_CMS0_API_KEY') {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing required Node env variable: ${key}`)
  }

  return value
}

export default defineConfig({
  entry: "./src/data/cms0.ts",
  api: {
    baseUrl: getRequiredEnv('VITE_CMS0_API_BASEURL'),
    key: getRequiredEnv('VITE_CMS0_API_KEY'),
  },
});
