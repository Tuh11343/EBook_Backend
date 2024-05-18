const prisma = require('../prisma/prisma')

class AuthorUtils {
  constructor() { }

  async findByID(id) {
    return await prisma.author.findFirst({
      where: {
        id: id
      },
    })
  }

  async count() {
    return await prisma.author.count({})
  }

  async countByName(name) {
    return await prisma.author.count({
      where: {
        name: {
          contains: name
        }
      }
    })
  }
}

module.exports = AuthorUtils
