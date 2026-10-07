const router = require('express').Router();

const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) return res.status(404).end();
  next();
};

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({});
    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body });
    return res.status(201).json(blog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/:id', blogFinder, async (req, res) => {
  return res.json(req.blog);
});

router.delete('/:id', blogFinder, async (req, res) => {
  try {
    await req.blog.destroy();
    return res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
