import dotenv from "dotenv"
dotenv.config()

const config = {
    port: process.env.PORT,
    mongodb_URL: process.env.MONGODB_URL,
    server_url: process.env.SERVER_URL
}

export default config