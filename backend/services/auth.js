import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const setUser = (user, expriesToken) => {
    return jwt.sign(user, config.security_key, expriesToken)
}

const getUser = (token) => {
    if (!token) { return null }
    return jwt.verify(token, config.security_key)
}

export { setUser, getUser }