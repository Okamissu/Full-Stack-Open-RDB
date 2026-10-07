const router = require('express').Router();
const { Blog } = require('../models');
const blogFinder = require('../middlewares/blogFinder');

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({});
    return res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body });
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
