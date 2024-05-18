const prisma = require('../prisma/prisma')

class FavoriteUtils {
  constructor() { }

  async findByID(id) {
    return await prisma.favorite.findFirst({
      where: {
        id: id
      },
    })
  }

}

module.exports = FavoriteUtils
