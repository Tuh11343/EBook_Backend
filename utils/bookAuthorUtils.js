const prisma = require('../prisma/prisma')

class BookAuthorUtils {
  constructor() { }

  async findByID(id) {
    return await prisma.bookAuthor.findFirst({
      where: {
        id: id
      },
    })
  }

  async count() {
    return await prisma.bookAuthor.count({})
  }

  async countByAuthorName(name) {
    return await prisma.bookAuthor.count({
      where: {
        author: {
          name: {
            contains: name
          }
        }
      },
    })
  }

  async countByBookName(name) {
    return await prisma.bookAuthor.count({
      where: {
        book: {
          name: {
            contains: name
          }
        }
      },
    })
  }
}

module.exports = BookAuthorUtils
