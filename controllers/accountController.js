const catchAsync = require('../utils/catchAsync')
const prisma = require('../prisma/prisma')
const AccountUtils = require('../utils/accountUtils')

const accountUtils = new AccountUtils()

exports.getAllAccounts = catchAsync(async (req, res) => {
  const accounts = await prisma.account.findMany()
  res.status(200).json({
    status: 'success',
    results: accounts.length,
    data: {
      accounts,
    },
  })
})

exports.getAccountById = catchAsync(async (req, res) => {
  const accountId = parseInt(req.query.id)
  if (!accountId) {
    res.status(400).json({ message: 'Please provide id to get account' })
  }
  const account = await accountUtils.getAccountById(accountId)
  if (!account) {
    res.status(400).json({ message: 'Account not exists, please create one!' })
  }
  res.status(200).json({ status: 'Get account successfully!', account })
})

exports.deleteAccountById = catchAsync(async (req, res) => {
  const accountId = parseInt(req.query.id)
  if (!accountId) {
    res.status(400).json({ message: 'Please provide id to get account' })
  }
  const account = await accountUtils.getAccountById(accountId)
  if (!account) {
    res.status(400).json({ message: 'Account not exists, please create one!' })
  }
  const deleteAccount = await prisma.account.delete({
    where: {
      id: accountId,
    },
  })
  if (deleteAccount) {
    res.status(200).json({ message: 'Delete account successfully!' })
  }
})

exports.updateAccountById = catchAsync(async (req, res) => {
  const data = req.body
  const accountId = parseInt(data.id)
  if (!accountId) {
    res.status(400).json({ message: 'Please provide id to get account' })
  }
  if (!data) {
    res.status(400).json({ message: 'Please provide content to update account' })
  }
  const account = await accountUtils.getAccountById(accountId)
  if (!account) {
    res.status(400).json({ message: 'Account not exists, please create one!' })
  }
  const updateAccount = await prisma.account.update({
    where: {
      id: accountId,
    },
    data:data
  })
  if (updateAccount) {
    res.status(200).json({ status: 'Update account successfully!', updateAccount })
  }
})

exports.findAccountByEmail = catchAsync(async (req, res) => {
  const accountEmail = req.query.email
  if (!accountEmail) {
    return res.status(400).json({ message: 'Please provide email to find account' })
  }
  const account = await accountUtils.getAccountByEmail(accountEmail)
  if (!account) {
    return res.status(400).json({ message: 'Account not exists, please create one!' })
  }
  return res.status(200).json({
    status: 'Get account successfully!',
    account,
  })
})

exports.signIn = catchAsync(async (req, res) => {
  const query=req.query
  if (!query) {
    return res.status(400).json({ message: 'No data provided' })
  }
  const account = await prisma.account.findFirst({
    where:{
      email:query.email,
      password:query.password
    }
  })
  if (!account) {
    return res.status(400).json({ message: 'Account not exists, please create one!' })
  }
  return res.status(200).json({
    status: 'Sign In successfully!',
    account,
  })
})

exports.create = catchAsync(async (req, res) => {
  const body=req.body
  if (!body) {
    return res.status(400).json({ message: 'No data provided' })
  }
  const account = await prisma.account.create({
    data:body
  })
  if (!account) {
    return res.status(400).json({ message: 'Create account Error!' })
  }
  return res.status(200).json({
    status: 'Create account successfully!',
    account,
  })
})
