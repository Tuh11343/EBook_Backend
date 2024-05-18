const prisma = require('../prisma/prisma')
const catchAsync = require('../utils/catchAsync')
const BookProgressUtils = require('../utils/bookProgressUtils')

const bookProgressUtils = new BookProgressUtils()

exports.getAllBookProgress = catchAsync(async (req, res) => {
  const bookProgress = await prisma.bookProgress.findMany()
  return res.status(200).json({
    status: 'Get all bookProgress successful !!!',
    data: bookProgress,
    length: bookProgress.length,
  })
})

exports.getBookProgressById = catchAsync(async (req, res) => {
  const bookProgressId = parseInt(req.params.id)
  const bookProgress = await bookProgressUtils.findByID(bookProgressId)
  if (!bookProgress) {
    return res.status(400).json({
      status: 'No bookProgress found',
    })
  }
  return res.status(200).json({
    status: 'Get bookProgress by id successful !!!',
    data: bookProgress,
  })
})

exports.getBookProgressByBookId = catchAsync(async (req, res) => {
  const bookId = parseInt(req.params.id)
  const bookProgress = await bookProgressUtils.findByBookId(bookId)
  if (!bookProgress) {
    return res.status(400).json({
      status: 'No bookProgress found',
    })
  }
  return res.status(200).json({
    status: 'Get bookProgress by book id successful !!!',
    data: bookProgress,
  })
})

exports.getBookProgressByUserId = catchAsync(async (req, res) => {
  const bookId = parseInt(req.params.id)
  const bookProgress = await bookProgressUtils.findByUserId(bookId)
  if (!bookProgress) {
    return res.status(400).json({
      status: 'No bookProgress found',
    })
  }
  return res.status(200).json({
    status: 'Get bookProgress by user id successful !!!',
    data: bookProgress,
  })
})

exports.createBookProgress = catchAsync(async (req, res) => {
  const data = req.body
  if (!data) {
    return res.status(400).json({
      status: 'No data provided',
    })
  }
  const result = await prisma.bookProgress.create({
    data: {
      book_id: data.book_id,
      user_id: data.user_id,
      progress: data.progress,
    },
  })
  if (!result) {
    return res.status(400).json({
      status: 'Create bookProgress failed !!!',
    })
  }
  return res.status(200).json({
    status: 'Create bookProgress successful !!!',
  })
})

exports.updateBookProgress = catchAsync(async (req, res) => {
  const data = req.body
  const bookProgressId = parseInt(req.params.id)
  const bookProgress = await bookProgressUtils.findByID(bookProgressId)
  if (!bookProgress) {
    return res.status(400).json({
      status: 'No bookProgress found',
    })
  }
  if (!data) {
    return res.status(400).json({
      status: 'No data provided',
    })
  }
  const result = await prisma.bookProgress.update({
    where: {
      id: bookProgressId,
    },
    data: {
      book_id: data.book_id ?? bookProgress.book_id,
      user_id: data.user_id ?? bookProgress.user_id,
      progress: data.progress ?? bookProgress.progress,
    },
  })
  if (!result) {
    return res.status(400).json({
      status: 'Update bookProgress failed !!!',
    })
  }
  return res.status(200).json({
    status: 'Update bookProgress successful !!!',
  })
})

exports.deleteBookProgress = catchAsync(async (req, res) => {
  const bookProgressId = parseInt(req.params.id)
  const bookProgress = bookProgressUtils.findByID(bookProgressId)
  if (!bookProgress) {
    return res.status(400).json({
      status: 'No bookProgress found',
    })
  }
  const result = prisma.bookProgress.delete({
    where: {
      id: bookProgressId,
    },
  })
  if (!result) {
    return res.status(400).json({
      status: 'Delete bookProgress failed !!!',
    })
  }
  return res.status(200).json({
    status: 'Delete bookProgress successful !!!',
  })
})
