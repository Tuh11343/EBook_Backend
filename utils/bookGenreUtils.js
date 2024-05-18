const prisma = require('../prisma/prisma')

class BookGenreUtils {
  constructor() { }

  async findByID(id) {
    return await prisma.bookGenre.findFirst({
      where: {
        id: id
      },
    })
  }

  async count() {
    return await prisma.bookGenre.count({})
  }

  async countByGenreName(name) {
    return await prisma.bookGenre.count({
      where: {
        genre: {
          name: {
            contains: name
          }
        }
      },
    })
  }

  async countByBookName(name) {
    return await prisma.bookGenre.count({
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

module.exports = BookGenreUtils
