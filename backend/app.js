import express from 'express'
import cookieParser from 'cookie-parser'
import apiRouter from './routes/api.routes.js'
import cors from 'cors'
import './services/cronJob.js'


const app = express()

// view engine setup
app.set('views', app.use('/views', express.static('views')))
app.set('view engine', 'jade')
app.set('views', 'views')

app.use(cors(
  {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))
app.use('/public', express.static('public'))


app.use('/api', apiRouter)

// error handler
app.use((err, req, res,) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  return res.render('error')
})

export default app