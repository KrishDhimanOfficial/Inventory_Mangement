import express from 'express'
import cookieParser from 'cookie-parser'
import apiRouter from './routes/api.routes.js'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import responseTime from 'response-time'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import config from './config/config.js'
import AuthenticateUser from './middleware/AuthenticateUser.js'
import users_controllers from './controllers/users.controller.js'
import restrictOrigin from './middleware/restrictOrigin.js'
const app = express()

// view engine setup
app.set('views', app.use('/views', express.static('views')))
app.set('view engine', 'jade')
app.set('views', 'views')
app.use(cors(
  {
    origin: config.client_url,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
))
app.use(helmet(
  {
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  }
))
app.use(compression(
  {
    level: 2, // compression level
    threshold: 0, // Compress all
    memLevel: 9, // memory usuage
    filter: (req, res) => compression.filter(req, res)
  }
))
app.use(rateLimit(
  {
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP
    message: 'Too many requests. Please try again later.'
  }
))
app.use(mongoSanitize())
app.use(xss())
app.use(responseTime((req, res, time) => console.log(`${req.method} ${req.url} - ${time.toFixed(2)} ms`)))
app.use(express.json())                            
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))
app.use('/public', express.static('public'))
app.use('/api/user/login', restrictOrigin, users_controllers.handleUserLogin)
app.use('/api', restrictOrigin, AuthenticateUser, apiRouter)

// error handler
app.use((err, req, res,) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.status(500).json({ error: 'Internal Server Error.' })
  return res.render('error')
})

export default app