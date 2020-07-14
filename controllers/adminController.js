const db = require('../models')
const imgur = require('imgur-node-api')
const adminService = require('../services/adminService')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminController = {
  // 餐廳後台
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', { categories: categories })
    })
  },

  postRestaurant: (req, res) => {
    const { name, description, categoryId } = req.body
    if (!name || !description || !categoryId) {
      req.flash('error_messages', '最少要填入餐廳名子、類別與介紹！')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error', err)
        Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then(restaurant => {
          req.flash('success_messages', '餐廳已成功創建')
          return res.redirect('/admin/restaurants')
        })
          .catch((error) => console.log(error))
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      })
        .then(restaurant => {
          req.flash('success_messages', '餐廳已成功創建')
          res.redirect('/admin/restaurants')
        })
        .catch((error) => console.log(error))
    }
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create',
          {
            categories: categories,
            restaurant: restaurant.toJSON()
          })
      })
    })
  },

  putRestaurant: (req, res) => {
    const { name, description, categoryId } = req.body
    if (!name || !description || !categoryId) {
      req.flash('error_messages', '最少要填入餐廳名子、類別與介紹！')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error', err)
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then(restaurant => {
                req.flash('success_messages', '餐廳已成功更新')
                res.redirect('/admin/restaurants')
              })
              .catch((error) => console.log(error))
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then(restaurant => {
              req.flash('success_messages', '餐廳已成功更新')
              res.redirect('/admin/restaurants')
            })
            .catch((error) => console.log(error))
        })
    }
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  // 使用者後台
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', { users: users })
    })
  },

  putUsers: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (req.user.id === Number(req.params.id)) {
          req.flash('error_messages', '不能把自己改成平民！')
          return res.redirect('back')
        }
        if (user.isAdmin) user.update({ isAdmin: false })
        else user.update({ isAdmin: true })
      })
      .then(users => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
  }
}

module.exports = adminController
