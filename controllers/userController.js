const catchAsync = require('../utils/catchAsync')
const prisma = require('../prisma/prisma')
const UserUtils = require('../utils/userUtils')

const userUtils = new UserUtils()

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await prisma.user.findMany()
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  })
})

exports.getUserById = catchAsync(async (req, res) => {
  const userId = parseInt(req.query.id)
  if (!userId) {
    res.status(400).json({ message: 'Please provide id to get user' })
  }
  const user = await userUtils.getUserById(userId)
  if (!user) {
    res.status(400).json({ message: 'User not exists, please create one!' })
  }
  res.status(200).json({ status: 'Get user successfully!', user })
})

exports.getByAccountID = catchAsync(async (req, res) => {
  const query=req.query
  if (!query) {
    res.status(400).json({ message: 'Please provide id to get user' })
  }
  const account = await prisma.account.findUnique({
    where:{
      id:parseInt(query.id)
    },
    include:{
      User:true
    }
  })
  if (!account) {
    res.status(400).json({ message: 'Account not exists, please create one!' })
  }
  return res.status(200).json({ status: 'Get account successfully!', user:account.User })
})

exports.deleteUserById = catchAsync(async (req, res) => {
  const userId = parseInt(req.query.id)
  if (!userId) {
    res.status(400).json({ message: 'Please provide id to get user' })
  }
  const user = await userUtils.getUserById(userId)
  if (!user) {
    res.status(400).json({ message: 'User not exists, please create one!' })
  }
  const deleteUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  })
  if (deleteUser) {
    res.status(200).json({ message: 'Delete user successfully!' })
  }
})

exports.updateUserById = catchAsync(async (req, res) => {
  const data = req.body
  const userId = parseInt(body.id)
  if (!userId) {
    res.status(400).json({ message: 'Please provide id to get user' })
  }
  if (!data) {
    res.status(400).json({ message: 'Please provide content to update user' })
  }
  const user = await userUtils.getUserById(userId)
  if (!user) {
    res.status(400).json({ message: 'User not exists, please create one!' })
  }
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data:data
  })
  if (updateUser) {
    res.status(200).json({ updateUser })
  }
})

exports.findUserByName = catchAsync(async (req, res) => {
  const userName = req.params.name
  if (!userName) {
    res.status(400).json({ message: 'Please provide username to get user' })
  }
  const user = await userUtils.getUserByName(userName)
  if (!user) {
    res.status(400).json({ message: 'User not exists, please create one!' })
  }
  res.status(200).json({
    status: 'Get user successfully!',
    user,
  })
})


exports.create = catchAsync(async (req, res) => {
  const body=req.body
  if (!body) {
    return res.status(400).json({ message: 'No data provided' })
  }
  const user = await prisma.user.create({
    data:body
  })
  if (!user) {
    return res.status(400).json({ message: 'User not exists, please create one!' })
  }
  return res.status(200).json({
    status: 'Create user successfully!',
    user,
  })
})
