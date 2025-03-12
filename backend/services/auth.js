import jwt from 'jsonwebtoken'
import config from '../config/config.js'

function setUser(user,expriesToken) {
    return jwt.sign(user, config.security_key, expriesToken)
}

function getUser(token) {
    if (!token) { return null }
    return jwt.verify(token, config.security_key)
}
console.log("helo");

export { setUser, getUser }