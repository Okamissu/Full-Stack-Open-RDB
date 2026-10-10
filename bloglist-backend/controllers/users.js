const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User, Blog } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['passwordHash'],
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      name,
      passwordHash,
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) {
      return res.status(404).end();
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = req.body.name;

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
