const prisma = require('../prisma/prisma')

class SubcriptionUtils {
  constructor() {}

  async findByID(id) {
    return await prisma.subscription.findFirst({
      where: {
        id:id
      },
    })
  }

  async count(){
    return await prisma.subscription.count({})
  }
}

module.exports = SubcriptionUtils
