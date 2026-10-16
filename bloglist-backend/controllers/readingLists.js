const router = require('express').Router();
const tokenExtractor = require('../middlewares/tokenExtractor');

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

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const userId = req.decodedToken.id;

    const entry = await UserBlogs.findByPk(id);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entry.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    entry.state = state;
    await entry.save();

    res.json(entry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
