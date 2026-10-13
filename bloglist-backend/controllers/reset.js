const { Blog, User } = require('../models')
const router = require('express').Router()

router.post('/', async (req, res) => {
  await Blog.destroy({
    where: {},
    truncate: true,
    cascade: true,
  })

  await User.destroy({
    where: {},
    truncate: true,
    cascade: true,
  })

  res.sendStatus(204)
})

module.exports = router
