const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = require('express').Router();

const { SECRET } = require('../util/config');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username: username,
      },
    });


    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect) || user.disabled) {
      return res.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, SECRET);

    await Session.create({
      sid: token, // Use the token as the session ID
      user_id: user.id,
    });

    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
