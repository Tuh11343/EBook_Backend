const prisma = require('../prisma/prisma')

class BookProgressUtils {
  constructor() {}

  async findByID(id) {
    return await prisma.bookProgress.findFirst({
      where: {
        id: id,
      },
    })
  }

  async findByBookId(bookId) {
    return await prisma.bookProgress.findFirst({
      where: {
        book_id: bookId,
      },
    })
  }

  async findByUserId(userId) {
    return await prisma.bookProgress.findFirst({
      where: {
        user_id: userId,
      },
    })
  }
}

module.exports = BookProgressUtils
