const prisma = require('../prisma/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const AWS = require('aws-sdk')
const SALT_ROUNDS = 10
const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY
const OTP_LENGTH = 6

AWS.config.update({
  region: process.env.AWS_REGION,
})

class AuthUtils {
  constructor(email, password) {
    this.email = email
    this.password = password
  }

  async getAccountByEmail() {
    return await prisma.account.findFirst({
      where: {
        email: this.email,
      },
    })
  }

  hashPassword() {
    return bcrypt.hashSync(this.password, SALT_ROUNDS)
  }

  comparePassword(hash) {
    return bcrypt.compareSync(this.password, hash)
  }

  signAccessToken() {
    return jwt.sign({ email: this.email }, JWT_ACCESS_SECRET_KEY, { expiresIn: '24h' })
  }

  signRefreshToken() {
    return jwt.sign({ email: this.email }, JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' })
  }

  generateOtp() {
    return otpGenerator.generate(OTP_LENGTH, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })
  }

  async sendOtpSMS(params) {
    return await new AWS.SNS({ apiVersion: '2010-03-31' })
      .publish(params)
      .promise()
      .then(() => {
        console.log('OTP SEND SUCCESS')
      })
  }
}

module.exports = AuthUtils
