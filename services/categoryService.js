const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', {
              categories: categories,
              category: category.toJSON()
            })
          })
      } else {
        callback({categories: categories})
      }
    })
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: '請輸入類別勿空白！'})
    } else {
      return Category.create({
        name: req.body.name
      })
        .then(category => {
          return callback({ status: 'success', message: '類別已經成功創建！'})
        })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: '請輸入類別勿空白！'})
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update(req.body)
        })
        .then(category => {
          return callback({ status: 'success', message: '類別已經成功更新！'})
        })
    }
  }
}

module.exports = categoryController
