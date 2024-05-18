const prisma = require('../prisma/prisma')

class GenreUtils {
  constructor() { }

  async findByID(id) {
    return await prisma.genre.findFirst({
      where: {
        id: id
      },
    })
  }

  async count() {
    return await prisma.genre.count()
  }

  async countWithName(name) {
    return await prisma.genre.count({
      where: {
        name: {
          contains: name
        }
      }
    })
  }
}

module.exports = GenreUtils
