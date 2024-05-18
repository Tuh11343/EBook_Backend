const prisma = require('../prisma/prisma')

class SubcriptionHistoryUtils {
  constructor() {}

  async findByID(id) {
    return await prisma.subscriptionHistory.findFirst({
      where: {
        id:id
      },
    })
  }

  async count(){
    return await prisma.subscriptionHistory.count({})
  }
}

module.exports = SubcriptionHistoryUtils
