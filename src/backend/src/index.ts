import 'dotenv/config'
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import { cors } from '@elysiajs/cors'
import { categoriesRoutes } from './routes/categories'
import { hairstylesRoutes } from './routes/hairstyles'
import { availabilityRoutes } from './routes/availability'
import { bookingsRoutes } from './routes/bookings'
import { emailRoutes } from './routes/email'

const port = Number(process.env.PORT) || 3000

const app = new Elysia({ adapter: node() })
  .use(cors())
  .use(categoriesRoutes)
  .use(hairstylesRoutes)
  .use(availabilityRoutes)
  .use(bookingsRoutes)
  .use(emailRoutes)
  .get('/health', () => ({ status: 'ok' }))
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })

export type App = typeof app
