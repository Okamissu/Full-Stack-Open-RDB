const router = require('express').Router();
const tokenExtractor = require('../middlewares/tokenExtractor');

const { Blog, User, UserBlogs } = require('../models');

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;

    if (userId === undefined || blogId === undefined) {
      return res.status(400).json({ error: 'userId and blogId are required' });
    }

    const [user, blog] = await Promise.all([
      User.findByPk(userId),
      Blog.findByPk(blogId),
    ]);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingEntry = await UserBlogs.findOne({
      where: { userId, blogId },
    });

    if (existingEntry) {
      return res.status(400).json({ error: 'Blog already in reading list' });
    }

    const newEntry = await UserBlogs.create({ userId, blogId });

    res.status(201).json({
      id: newEntry.id,
      userId: newEntry.userId,
      blogId: newEntry.blogId,
      read: newEntry.state,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const userId = req.decodedToken.id;

    if (typeof read !== 'boolean') {
      return res.status(400).json({ error: 'read must be a boolean' });
    }

    const entry = await UserBlogs.findByPk(id);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entry.userId !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    entry.state = read;
    await entry.save();

    res.json({
      id: entry.id,
      userId: entry.userId,
      blogId: entry.blogId,
      read: entry.state,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
