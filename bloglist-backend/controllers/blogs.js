const router = require('express').Router();
const { Blog, User } = require('../models');
const blogFinder = require('../middlewares/blogFinder');
const tokenExtractor = require('../middlewares/tokenExtractor');

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({});
    return res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);

    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }
    
    const blog = await Blog.create({ ...req.body, userId: user.id });
    return res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', blogFinder, async (req, res) => {
  return res.json(req.blog);
});

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    await req.blog.destroy();
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
