import nodemailer from 'nodemailer'
import config from '../config/config.js'

const transporter = nodemailer.createTransport({
    host: config.emailHost,
    service: config.emailService,
    port: 587,
    secure: false,
    auth: {
        user: config.emailAuth,
        pass: config.emailPass,
    }
})

export default transporter