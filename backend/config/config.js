import dotenv from "dotenv"
dotenv.config()

const config = {
    port: process.env.PORT,
    mongodb_URL: process.env.MONGODB_URL,
    server_url: process.env.SERVER_URL,
    emailHost: process.env.HOST,
    emailService: process.env.SERVICE,
    emailAuth: process.env.SENDER_EMAIL,
    emailPass: process.env.EMAIL_APP_PASSWORD,
    security_key: process.env.SECURITY_KEY
}

export default config