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
    security_key: process.env.SECURITY_KEY,
    productImgPath: process.env.PRODUCT_IMAGE_PATH,
    client_url: process.env.CLIENT_URL,
    logoImgPath: process.env.LOGO_PATH
}

export default config