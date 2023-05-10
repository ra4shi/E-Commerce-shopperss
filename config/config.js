const dotenv = require('dotenv')
const sessionSecret = process.env.sessionSecret

const emailUser = "rashid813895@gmail.com"
const emailPassword = process.env.emailPassword;

module.exports = {
    sessionSecret,
    emailPassword,
    emailUser
}