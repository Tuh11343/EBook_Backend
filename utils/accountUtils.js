const prisma = require('../prisma/prisma')

class AccountUtils {
  constructor() {}

  async getAccountByEmail(email) {
    return await prisma.account.findFirst({
      where: {
        email: email,
      },
    })
  }

  async getAccountById(id) {
    return await prisma.account.findFirst({
      where: {
        id: id,
      },
    })
  }
}

module.exports = AccountUtils
