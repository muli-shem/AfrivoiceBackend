import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import {cors }from "hono/cors"
import { trimTrailingSlash } from 'hono/trailing-slash'
import { timeout } from 'hono/timeout'
import { HTTPException } from 'hono/http-exception'
import { prometheus } from '@hono/prometheus'

//Routers
import { usersRouter } from './users/users.Router'
import { leadersRouter } from './leaders/leaders.Router'
import { leaderscommuneRouter } from './leadercommunication/leadercommunications.Router'
import {authRouter} from "./auth/auth.Router"
import {educationRouter} from "./education/education.Router";
import {projectsRouter} from "./projects/projects.Router";
import { commentsRouter } from './comments/comments.Router'
import { feedbackRouter } from './feedbackreports/feedbackreports.Router'



const app = new Hono()

const customTimeoutException = () =>
  new HTTPException(408, {
    message: `Request timeout after waiting for more than 10 seconds`,
  })

const { printMetrics, registerMetrics } = prometheus()

// inbuilt middlewares
app.use(logger())  //logs request and response to the console
app.use(csrf()) //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()) //removes trailing slashes from the request URL
app.use('/', timeout(10000, customTimeoutException))
//3rd party middlewares
app.use('*', registerMetrics)

app.use('*', cors())
// default route
app.get('/ok', (c) => {
  return c.text('The server is running!')
})
app.get('/timeout', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 11000))
  return c.text("data after 5 seconds", 200)
})
app.get('/metrics', printMetrics)

// custom route
app.route('/api',usersRouter)
app.route('/api', leadersRouter)
app.route('/api', leaderscommuneRouter)
app.route('/api', authRouter)
app.route('/api', educationRouter);
app.route('/api', projectsRouter);
app.route('/api', commentsRouter)
app.route('/api', feedbackRouter)



serve({
  fetch: app.fetch,
  port: Number(process.env.PORT||3000)
})
console.log(`Server is running on port ${process.env.PORT}`)