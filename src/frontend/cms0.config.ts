import dotenv from 'dotenv'
import { defineConfig } from '@cms0/cms0/config'

dotenv.config()

export default defineConfig({
    entry: 'src/data/cms0.ts',
    api: {
        baseUrl: process.env.VITE_CMS0_API_BASEURL,
        key: process.env.VITE_CMS0_API_KEY,
    },
})
