const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signup: (req, res) => {
    // 確認密碼
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
    // 確認信箱是否重複
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    const id = req.params.id
    const pageLimit = 7
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Comment.findAndCountAll({ include: Restaurant, where: { UserId: id }, offset: offset, limit: pageLimit })
      .then(result => {
        const count = result.count
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1
        const comments = result.rows.map(r => ({
          id: r.Restaurant.id,
          image: r.Restaurant.image
        }))
        return User.findByPk(id)
          .then(profile => {
            return res.render('users/profile', {
              profile: profile.toJSON(),
              count: count,
              page: page,
              totalPage: totalPage,
              prev: prev,
              next: next,
              comments: comments
            })
          })
      })
  },

  editUser: (req, res) => {
    return User.findByPk(req.user.id)
      .then(user => {
        return res.render('users/edit', { user: user.toJSON() })
      })
  },

  putUser: (req, res) => {
    console.log(req.body.name)
    if (!req.body.name) {
      req.flash('error_messages', '名字不能空白！')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error', err)
        return User.findByPk(req.user.id)
          .then(user => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
              .then(user => {
                req.flash('success_messages', '個人檔案更新成功！')
                res.redirect(`/users/${user.id}`)
              })
              .catch((error) => console.log(error))
          })
      })
    } else {
      return User.findByPk(req.user.id)
        .then(user => {
          user.update({
            name: req.body.name,
            image: user.image
          })
            .then(user => {
              req.flash('success_messages', '個人檔案更新成功！')
              res.redirect(`/users/${user.id}`)
            })
            .catch((error) => console.log(error))
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy()
        .then(restaurant => {
          return res.redirect('back')
        })
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(restaurant => {
        return res.redirect('back')
      })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      like.destroy()
        .then(restaurant => {
          return res.redirect('back')
        })
    })
  },

  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  }
}

module.exports = userController
