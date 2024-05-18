const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const prisma = require('../prisma/prisma')
const AuthUtils = require('../utils/authUtils')

exports.register = catchAsync(async (req, res, next) => {
  const data = req.body
  const authUtils = new AuthUtils(data.email, data.password)

  try {
    let account = await authUtils.getAccountByEmail()
    if (account) {
      res.status(400).json({ message: 'Account already exists' })
      return
    }

    const hashPassword = await authUtils.hashPassword()

    const user = await prisma.user.create({
      data: {
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber,
      },
    })
    const mobile = '+84828098274'

    const OtpCode = authUtils.generateOtp()
    const params = {
      Message: `Your OTP code is: ${OtpCode}`,
      PhoneNumber: mobile,
    }
    await authUtils.sendOtpSMS(params)
    const ttl = 5 * 60 * 1000
    const expiresIn = Date.now() + ttl
    account = await prisma.account.create({
      data: {
        email: data.email,
        password: hashPassword,
        user_id: user.id,
        otpCode: OtpCode,
        otpExpires: new Date(expiresIn),
      },
    })

    res.status(200).json({ message: 'Register successfully!' })
  } catch (e) {
    next(new AppError(e, 500))
  }
})

exports.login = catchAsync(async (req, res, next) => {
  const data = req.body
  const authUtils = new AuthUtils(data.email, data.password)

  try {
    const account = await authUtils.getAccountByEmail()
    if (!account) {
      res.status(400).json({ message: 'Account not exists, please create one!' })
      return
    }

    if (!account.is_verified) {
      res.status(400).json({ message: 'Account is not veried!' })
      return
    }

    const isPasswordValid = authUtils.comparePassword(account.password)

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Password is not correct!' })
      return
    }
    const accessToken = authUtils.signAccessToken()
    const refreshToken = authUtils.signRefreshToken()
    res.status(200).json({ accessToken, refreshToken })
  } catch (e) {
    next(new AppError(e, 500))
  }
})

exports.checkIsLogin = catchAsync(async (req, res, next) => {
  const data = req.body
  const authUtils = new AuthUtils(data.email, data.password)

  try {
    const account = await authUtils.getAccountByEmail()
    if (!account) {
      res.status(400).json({ message: 'Account not exists, please create one!', isLogin: false })
      return
    }

    const isPasswordValid = authUtils.comparePassword(account.password)
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Password is not correct!', isLogin: false })
      return
    }

    res.status(200).json({ message: 'Login successfully!', isLogin: true })
  } catch (e) {
    next(new AppError(e, 500))
  }
})

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const data = req.body
  try {
    const otpCode = data.otpCode
    const currentTime = Date.now()

    const account = await prisma.account.findFirst({
      where: {
        otpCode,
      },
    })
    if (!account) {
      res.status(400).json({ message: 'Account not exists, please create one!' })
      return
    }
    if (currentTime > parseInt(account.expiresIn)) {
      res.status(400).json({ message: 'OTP code expires' })
      return
    }
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        is_verified: true,
        otpCode: '',
      },
    })
    res.status(200).send({ message: 'Verify account success' })
  } catch (e) {
    next(new AppError(e, 500))
  }
})
