const prisma = require('../prisma/prisma')

class UserUtils {
  constructor() {}

  async getUserById(id) {
    return await prisma.user.findFirst({
      where: {
        id: id,
      },
    })
  }

  async getUserByName(name) {
    return await prisma.user.findFirst({
      where: {
        name: name
      },
    })
  }
}

module.exports = UserUtils
