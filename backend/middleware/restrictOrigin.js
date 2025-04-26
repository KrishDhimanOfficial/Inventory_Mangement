import config from "../config/config.js"

const restrictOrigin = async (req, res, next) => {
    try {
        const referer = req.get("Referer") || '';
        if (!referer.startsWith(config.client_url)) {
            return res.status(403).json({ message: "Access denied." })
        }
        next()
    } catch (error) {
        console.log('restrictOrigin : ' + error.message)
        return res.status(500).json({ message: "Access denied." })
    }
}

export default restrictOrigin