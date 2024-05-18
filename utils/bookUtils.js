const prisma = require('../prisma/prisma')

class BookUtils {
  constructor() { }

  async findByID(id) {
    return await prisma.book.findFirst({
      where: {
        id: id
      },
    })
  }

  async count() {
    return await prisma.book.count({})
  }

  async countByname(name) {
    return await prisma.book.count({
      where: {
        OR: [{
          name: {
            contains: name
          }
        }, {
          bookAuthor: {
            some: {
              author: {
                name: {
                  contains: name
                }
              }
            }
          }
        }
        ]
      },
    })
  }

  async countByGenreList(genreList) {
    return await prisma.book.count({
      where: {
        bookGenres: {
          every: {
            genre: {
              id: {
                in: genreList
              }
            }
          }
        }
      },
    })
  }

  async countByGenre(genreID) {
    return await prisma.book.count({
      where: {
        bookGenres: {
          some: {
            genre_id: parseInt(genreID)
          }
        }
      }
    })
  }

  async countByAuthor(authorID) {
    return await prisma.book.count({
      where: {
        bookAuthor: {
          some: {
            author_id: parseInt(authorID)
          }
        }
      }
    })
  }

  async countByName(name){
    return await prisma.book.count({
      where:{
        name:{
          contains:name
        }
      }
    })
  }

  async countByNameAndGenre(name,genreID){
    return await prisma.book.count({
      where:{
        bookGenres: {
          some: {
            genre_id: parseInt(genreID)
          }
        },
        name:{
          contains:name
        }
      }
    })
  }


}

module.exports = BookUtils
