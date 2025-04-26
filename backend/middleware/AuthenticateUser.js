import { getUser } from "../services/auth.js"

const AuthenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        if (!token) return res.status(404).json({ error: 'Access denied.' })
        const user = getUser(token)
        req.user = user;
        next()
    } catch (error) {
        console.log('AuthenticateUser : ', error.message)
        if (error.message === 'jwt malformed') return res.json({ error: 'Access denied.' })
        if (error.message === 'jwt expired') return res.json({ error: 'Access denied.' })
        return res.status(403).json({ error: "Forbidden" });
    }
}

export default AuthenticateUser