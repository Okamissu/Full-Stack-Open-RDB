const router = require('express').Router();

const { UserBlogs } = require('../models');

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;

    const existingEntry = await UserBlogs.findOne({
      where: { userId, blogId },
    });

    if (existingEntry) {
      return res.status(400).json({ error: 'Blog already in reading list' });
    }

    const newEntry = await UserBlogs.create({ userId, blogId });

    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
